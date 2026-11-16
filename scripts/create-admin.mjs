#!/usr/bin/env node
// Create an admin user, or reset an existing user's password.
//
// This is the ONLY way to create a user: the Worker's database role can read
// `users` but not write it, so this has to run with the owner connection string.
//
//   OWNER_DATABASE_URL='postgres://owner:...@host/db?sslmode=require' npm run create-admin
//
// The password is typed at a hidden prompt, never passed as an argument, so it
// doesn't end up in shell history or the process list.

import postgres from "postgres";
import { hashPassword } from "../worker/password.js";

const USERNAME_RE = /^[a-z0-9_]{3,32}$/;
const MIN_PASSWORD = 12;

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve, reject) => {
    const { stdin, stdout } = process;
    stdout.write(question);
    if (!hidden) {
      stdin.resume();
      stdin.setEncoding("utf8");
      stdin.once("data", (data) => {
        stdin.pause();
        resolve(String(data).replace(/\r?\n$/, ""));
      });
      return;
    }
    if (!stdin.isTTY) return reject(new Error("run this in an interactive terminal"));
    let value = "";
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === "\r" || ch === "\n") {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off("data", onData);
          stdout.write("\n");
          return resolve(value);
        }
        if (ch === "\u0003") {
          stdin.setRawMode(false);
          stdout.write("\n");
          process.exit(130);
        }
        if (ch === "\u007f" || ch === "\b") value = value.slice(0, -1);
        else value += ch;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  const url = process.env.OWNER_DATABASE_URL;
  if (!url) {
    console.error("Set OWNER_DATABASE_URL to the database owner's connection string.");
    process.exit(1);
  }

  const username = (await ask("Username: ")).trim().toLowerCase();
  if (!USERNAME_RE.test(username)) {
    console.error("Username must be 3–32 characters: lowercase letters, numbers, underscore.");
    process.exit(1);
  }

  const sql = postgres(url, { max: 1, onnotice: () => {} });
  try {
    const [existing] = await sql`select id from users where username = ${username}`;
    if (existing) {
      const answer = await ask(`User "${username}" exists. Reset their password and sign out all sessions? [y/N] `);
      if (answer.trim().toLowerCase() !== "y") {
        console.log("Nothing changed.");
        return;
      }
    }

    const password = await ask("Password: ", { hidden: true });
    if (password.length < MIN_PASSWORD) {
      console.error(`Password must be at least ${MIN_PASSWORD} characters.`);
      process.exitCode = 1;
      return;
    }
    if ((await ask("Confirm password: ", { hidden: true })) !== password) {
      console.error("Passwords don't match.");
      process.exitCode = 1;
      return;
    }

    const passwordHash = await hashPassword(password);
    if (existing) {
      await sql.begin(async (tx) => {
        await tx`update users set password_hash = ${passwordHash} where id = ${existing.id}`;
        await tx`delete from sessions where user_id = ${existing.id}`;
      });
      console.log(`Password reset for "${username}". All their sessions were signed out.`);
    } else {
      await sql`insert into users (username, password_hash) values (${username}, ${passwordHash})`;
      console.log(`Created admin "${username}".`);
    }
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
