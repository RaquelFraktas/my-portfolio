const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const LIMITS = { slug: 120, title: 200, summary: 500, body: 200_000 };

// Validates an admin create/update payload. Only known fields are accepted,
// so nothing else from the request can end up in a query.
export function parsePostInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { error: "body must be a JSON object" };
  }

  const post = {
    slug: input.slug,
    title: input.title,
    summary: input.summary ?? "",
    body: input.body ?? "",
    status: input.status ?? "draft",
  };

  for (const field of ["slug", "title", "summary", "body", "status"]) {
    if (typeof post[field] !== "string") return { error: `${field} must be a string` };
  }

  post.slug = post.slug.trim();
  post.title = post.title.trim();
  post.summary = post.summary.trim();

  if (!SLUG_RE.test(post.slug) || post.slug.length > LIMITS.slug) {
    return { error: "slug must be lowercase letters, numbers and single dashes" };
  }
  if (post.title.length < 1 || post.title.length > LIMITS.title) {
    return { error: `title must be 1–${LIMITS.title} characters` };
  }
  if (post.summary.length > LIMITS.summary) {
    return { error: `summary must be at most ${LIMITS.summary} characters` };
  }
  if (post.body.length > LIMITS.body) {
    return { error: `body must be at most ${LIMITS.body} characters` };
  }
  if (post.status !== "draft" && post.status !== "published") {
    return { error: "status must be draft or published" };
  }

  return { post };
}

export function parseId(raw) {
  return /^[1-9][0-9]{0,9}$/.test(raw) ? Number(raw) : null;
}

export function isValidSlug(raw) {
  return typeof raw === "string" && raw.length <= LIMITS.slug && SLUG_RE.test(raw);
}
