import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Markdown from "../../components/Markdown";
import { api } from "../../lib/api";

const EMPTY = { title: "", slug: "", summary: "", body: "", status: "draft" };

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/, "");
}

// Remount per post so switching posts (or new → saved) starts from fresh state.
export default function AdminPostEditor() {
  const { id } = useParams();
  return <Editor key={id ?? "new"} id={id} />;
}

function Editor({ id }) {
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [tab, setTab] = useState("write");

  useEffect(() => {
    if (isNew) return;
    api
      .adminGetPost(id)
      .then(({ post }) => {
        setForm({
          title: post.title,
          slug: post.slug,
          summary: post.summary,
          body: post.body,
          status: post.status,
        });
        setSlugTouched(true);
      })
      .catch((err) => setMessage({ type: "error", text: err.message }))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  function update(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !slugTouched) next.slug = slugify(value);
      return next;
    });
  }

  async function save(status) {
    setSaving(true);
    setMessage(null);
    const payload = { ...form, status };
    try {
      if (isNew) {
        const { post } = await api.createPost(payload);
        navigate(`/admin/posts/${post.id}`, { replace: true });
      } else {
        const { post } = await api.updatePost(id, payload);
        setForm((prev) => ({ ...prev, status: post.status }));
      }
      setMessage({ type: "ok", text: status === "published" ? "Published." : "Saved as draft." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${form.title}"? This can't be undone.`)) return;
    try {
      await api.deletePost(id);
      navigate("/admin", { replace: true });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  }

  if (loading) return <p className="blog-page__status">Loading…</p>;

  return (
    <section className="admin__editor">
      <div className="admin__row">
        <Link to="/admin" className="admin__back">← all posts</Link>
        {form.status === "published" && !isNew && (
          <Link to={`/blog/${form.slug}`} target="_blank" className="admin__back">view live post ↗</Link>
        )}
      </div>

      <label className="admin__field">
        <span>Title</span>
        <input value={form.title} maxLength={200} onChange={(e) => update("title", e.target.value)} required />
      </label>

      <label className="admin__field">
        <span>Slug <small className="admin__muted">/blog/{form.slug || "…"}</small></span>
        <input
          value={form.slug}
          maxLength={120}
          onChange={(e) => {
            setSlugTouched(true);
            update("slug", e.target.value.toLowerCase());
          }}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          required
        />
      </label>

      <label className="admin__field">
        <span>Summary <small className="admin__muted">shown on the blog list</small></span>
        <textarea rows={2} maxLength={500} value={form.summary} onChange={(e) => update("summary", e.target.value)} />
      </label>

      <div className="admin__field">
        <div className="admin__tabs" role="tablist">
          {["write", "preview"].map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              className={`nav-link${tab === t ? " active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
          <small className="admin__muted">markdown</small>
        </div>
        {tab === "write" ? (
          <textarea
            className="admin__body"
            rows={22}
            value={form.body}
            onChange={(e) => update("body", e.target.value)}
            aria-label="Post body"
          />
        ) : (
          <div className="admin__preview">
            {form.body ? <Markdown>{form.body}</Markdown> : <p className="admin__muted">Nothing to preview.</p>}
          </div>
        )}
      </div>

      {message && <p className={message.type === "error" ? "admin__error" : "admin__ok"}>{message.text}</p>}

      <div className="admin__actions">
        <button type="button" className="nav-link" disabled={saving} onClick={() => save("draft")}>
          {form.status === "published" ? "Unpublish (save as draft)" : "Save draft"}
        </button>
        <button type="button" className="nav-link" disabled={saving} onClick={() => save("published")}>
          {form.status === "published" ? "Update" : "Publish"}
        </button>
        {!isNew && (
          <button type="button" className="nav-link admin__delete" onClick={remove}>
            Delete
          </button>
        )}
      </div>
    </section>
  );
}
