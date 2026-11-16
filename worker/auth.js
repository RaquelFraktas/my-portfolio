import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { bodyLimit } from "hono/body-limit";
import { verifyPassword, burnPasswordCheck } from "./password.js";

const SESSION_DAYS = 7;
const LOCKOUT_MINUTES = 15;
const MAX_FAILURES_PER_USERNAME = 5;
const MAX_FAILURES_PER_IP = 20;
const USERNAME_RE = /^[a-z0-9_]{3,32}$/;

// ---- helpers ------------------------------------------------------------------

function cookieOptions(c) {
  const secure = new URL(c.req.url).protocol === "https:";
  return {
    // __Host- prefix: browser only accepts it over HTTPS, for this exact host, path /
    prefix: secure ? "host" : undefined,
    secure,
    httpOnly: true,
    sameSite: "Strict",
    path: "/",
  };
}

const COOKIE_NAME = "blog_session";

function readSessionCookie(c) {
  const opts = cookieOptions(c);
  return opts.prefix ? getCookie(c, COOKIE_NAME, opts.prefix) : getCookie(c, COOKIE_NAME);
}

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function newSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function clientIp(c) {
  return c.req.header("CF-Connecting-IP") ?? "local";
}

// Writes must come from this site as JSON, not a form or script on another origin.
async function sameOriginWrites(c, next) {
  if (!["GET", "HEAD", "OPTIONS"].includes(c.req.method)) {
    if (c.req.header("Origin") !== new URL(c.req.url).origin) {
      return c.json({ error: "bad origin" }, 403);
    }
    const type = c.req.header("Content-Type") ?? "";
    if (c.req.method !== "DELETE" && !type.startsWith("application/json")) {
      return c.json({ error: "expected application/json" }, 415);
    }
  }
  await next();
}

// ---- middleware for /api/admin/* ---------------------------------------------

export async function requireAdmin(c, next) {
  const token = readSessionCookie(c);
  if (!token) return c.json({ error: "unauthorized" }, 401);

  const sql = c.get("sql")();
  const [session] = await sql`
    select u.id, u.username
    from sessions s join users u on u.id = s.user_id
    where s.token_hash = ${await sha256Hex(token)} and s.expires_at > now()
  `;
  if (!session) return c.json({ error: "unauthorized" }, 401);

  c.set("admin", session);
  c.header("Cache-Control", "no-store");
  return sameOriginWrites(c, next);
}

// ---- /api/auth/* ----------------------------------------------------------------

export const authRoutes = new Hono();

authRoutes.use("*", sameOriginWrites);
authRoutes.use("*", bodyLimit({ maxSize: 4 * 1024, onError: (c) => c.json({ error: "too large" }, 413) }));
authRoutes.use("*", async (c, next) => {
  c.header("Cache-Control", "no-store");
  await next();
});

const INVALID = { error: "invalid username or password" };

authRoutes.post("/login", async (c) => {
  let input;
  try {
    input = await c.req.json();
  } catch {
    return c.json({ error: "invalid JSON" }, 400);
  }
  const username = typeof input?.username === "string" ? input.username.trim().toLowerCase() : "";
  const password = typeof input?.password === "string" ? input.password : "";
  if (!username || !password || password.length > 1024) return c.json(INVALID, 401);

  const sql = c.get("sql")();
  const ip = clientIp(c);

  const [{ by_user, by_ip }] = await sql`
    select
      count(*) filter (where username = ${username})::int as by_user,
      count(*) filter (where ip = ${ip})::int as by_ip
    from login_failures
    where attempted_at > now() - make_interval(mins => ${LOCKOUT_MINUTES})
      and (username = ${username} or ip = ${ip})
  `;
  if (by_user >= MAX_FAILURES_PER_USERNAME || by_ip >= MAX_FAILURES_PER_IP) {
    return c.json({ error: `too many failed attempts, try again in ${LOCKOUT_MINUTES} minutes` }, 429);
  }

  const [user] = USERNAME_RE.test(username)
    ? await sql`select id, password_hash from users where username = ${username}`
    : [];
  const ok = user ? await verifyPassword(password, user.password_hash) : await burnPasswordCheck(password);

  if (!ok) {
    await sql`insert into login_failures (username, ip) values (${username.slice(0, 64)}, ${ip})`;
    await sql`delete from login_failures where attempted_at < now() - interval '1 day'`;
    return c.json(INVALID, 401);
  }

  const token = newSessionToken();
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  await sql.begin(async (tx) => {
    await tx`delete from login_failures where username = ${username}`;
    await tx`delete from sessions where expires_at <= now()`;
    await tx`
      insert into sessions (token_hash, user_id, expires_at)
      values (${await sha256Hex(token)}, ${user.id}, now() + make_interval(secs => ${maxAge}))
    `;
  });

  setCookie(c, COOKIE_NAME, token, { ...cookieOptions(c), maxAge });
  return c.json({ username });
});

authRoutes.post("/logout", async (c) => {
  const token = readSessionCookie(c);
  if (token) {
    const sql = c.get("sql")();
    await sql`delete from sessions where token_hash = ${await sha256Hex(token)}`;
  }
  deleteCookie(c, COOKIE_NAME, cookieOptions(c));
  return c.json({ ok: true });
});
