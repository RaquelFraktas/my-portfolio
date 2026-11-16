export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: "same-origin",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response; handled below
  }
  if (!res.ok || !data) {
    throw new ApiError(res.status, data?.error ?? `request failed (${res.status})`);
  }
  return data;
}

export const api = {
  listPosts: () => request("/posts"),
  getPost: (slug) => request(`/posts/${encodeURIComponent(slug)}`),

  login: (username, password) => request("/auth/login", { method: "POST", body: { username, password } }),
  logout: () => request("/auth/logout", { method: "POST", body: {} }),
  me: () => request("/admin/me"),
  adminListPosts: () => request("/admin/posts"),
  adminGetPost: (id) => request(`/admin/posts/${id}`),
  adminPostIdBySlug: (slug) => request(`/admin/posts/by-slug/${encodeURIComponent(slug)}`),
  createPost: (post) => request("/admin/posts", { method: "POST", body: post }),
  updatePost: (id, post) => request(`/admin/posts/${id}`, { method: "PUT", body: post }),
  deletePost: (id) => request(`/admin/posts/${id}`, { method: "DELETE" }),
};

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
