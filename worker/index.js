import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import postgres from "postgres";
import { requireAdmin, authRoutes } from "./auth.js";
import { parsePostInput, parseId, isValidSlug } from "./posts.js";

const app = new Hono();
const api = new Hono();

// One short-lived client per request; Hyperdrive (if used) does the pooling.
api.use("*", async (c, next) => {
  let sql;
  c.set("sql", () => {
    if (!sql) {
      const url = c.env.HYPERDRIVE?.connectionString ?? c.env.DATABASE_URL;
      if (!url) throw new Error("no database configured");
      sql = postgres(url, {
        max: 1,
        connect_timeout: 10,
        // Neon URLs carry channel_binding=require, but Workers sockets don't expose
        // the server certificate SCRAM-PLUS needs, so the connection would close.
        // TLS is still enforced (sslmode=require) and workerd verifies the cert.
        channel_binding: "prefer",
      });
    }
    return sql;
  });
  c.header("X-Content-Type-Options", "nosniff");
  await next();
  if (sql) c.executionCtx.waitUntil(sql.end({ timeout: 5 }));
});

api.onError((err, c) => {
  if (err.code === "23505") return c.json({ error: "a post with that slug already exists" }, 409);
  if (err.code === "23514") return c.json({ error: "post failed validation" }, 400);
  console.error("api error:", err);
  return c.json({ error: "internal error" }, 500);
});

// ---- public ---------------------------------------------------------------

const PUBLIC_COLUMNS = ["slug", "title", "summary", "published_at"];

api.get("/posts", async (c) => {
  const sql = c.get("sql")();
  const posts = await sql`
    select ${sql(PUBLIC_COLUMNS)} from posts
    where status = 'published'
    order by published_at desc
    limit 200
  `;
  c.header("Cache-Control", "public, max-age=60");
  return c.json({ posts });
});

api.get("/posts/:slug", async (c) => {
  const slug = c.req.param("slug");
  if (!isValidSlug(slug)) return c.json({ error: "not found" }, 404);

  const sql = c.get("sql")();
  const [post] = await sql`
    select ${sql([...PUBLIC_COLUMNS, "body", "updated_at"])} from posts
    where slug = ${slug} and status = 'published'
  `;
  if (!post) return c.json({ error: "not found" }, 404);
  c.header("Cache-Control", "public, max-age=60");
  return c.json({ post });
});

// ---- admin ----------------------------------------------------------------

const admin = new Hono();
admin.use("*", requireAdmin);
admin.use("*", bodyLimit({ maxSize: 512 * 1024, onError: (c) => c.json({ error: "too large" }, 413) }));

admin.get("/me", (c) => c.json({ username: c.get("admin").username }));

admin.get("/posts", async (c) => {
  const sql = c.get("sql")();
  const posts = await sql`
    select id, slug, title, status, published_at, updated_at from posts
    order by coalesce(published_at, created_at) desc
  `;
  return c.json({ posts });
});

admin.get("/posts/:id", async (c) => {
  const id = parseId(c.req.param("id"));
  if (!id) return c.json({ error: "not found" }, 404);
  const sql = c.get("sql")();
  const [post] = await sql`select * from posts where id = ${id}`;
  if (!post) return c.json({ error: "not found" }, 404);
  return c.json({ post });
});

async function readPostInput(c) {
  let raw;
  try {
    raw = await c.req.json();
  } catch {
    return { error: "invalid JSON" };
  }
  return parsePostInput(raw);
}

admin.post("/posts", async (c) => {
  const { post, error } = await readPostInput(c);
  if (error) return c.json({ error }, 400);

  const sql = c.get("sql")();
  const [created] = await sql`
    insert into posts (slug, title, summary, body, status, published_at)
    values (
      ${post.slug}, ${post.title}, ${post.summary}, ${post.body}, ${post.status},
      case when ${post.status} = 'published' then now() end
    )
    returning *
  `;
  return c.json({ post: created }, 201);
});

admin.put("/posts/:id", async (c) => {
  const id = parseId(c.req.param("id"));
  if (!id) return c.json({ error: "not found" }, 404);
  const { post, error } = await readPostInput(c);
  if (error) return c.json({ error }, 400);

  const sql = c.get("sql")();
  const [updated] = await sql`
    update posts set
      slug = ${post.slug},
      title = ${post.title},
      summary = ${post.summary},
      body = ${post.body},
      status = ${post.status},
      -- first publish stamps the date; later edits keep it
      published_at = coalesce(published_at, case when ${post.status} = 'published' then now() end),
      updated_at = now()
    where id = ${id}
    returning *
  `;
  if (!updated) return c.json({ error: "not found" }, 404);
  return c.json({ post: updated });
});

admin.delete("/posts/:id", async (c) => {
  const id = parseId(c.req.param("id"));
  if (!id) return c.json({ error: "not found" }, 404);
  const sql = c.get("sql")();
  const result = await sql`delete from posts where id = ${id}`;
  if (result.count === 0) return c.json({ error: "not found" }, 404);
  return c.body(null, 204);
});

api.route("/auth", authRoutes);
api.route("/admin", admin);
api.all("*", (c) => c.json({ error: "not found" }, 404));

app.route("/api", api);
// Everything else is the React app.
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
