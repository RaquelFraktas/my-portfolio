import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import Markdown from "../components/Markdown";
import { api, formatDate } from "../lib/api";
import "./BlogPage.css";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ slug: null, post: null, error: null });

  useEffect(() => {
    let cancelled = false;
    api
      .getPost(slug)
      .then((data) => !cancelled && setState({ slug, post: data.post, error: null }))
      .catch((err) =>
        !cancelled &&
        setState({
          slug,
          post: null,
          error: err.status === 404 ? "That post doesn't exist." : "Couldn't load this post right now.",
        }),
      );
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Signed-in admins get an edit link; for everyone else this request is
  // rejected (401) and nothing shows.
  const [edit, setEdit] = useState({ slug: null, id: null });
  useEffect(() => {
    let cancelled = false;
    api
      .adminPostIdBySlug(slug)
      .then(({ id }) => !cancelled && setEdit({ slug, id }))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);
  const editId = edit.slug === slug ? edit.id : null;

  const loading = state.slug !== slug;
  const { post, error } = state;

  useEffect(() => {
    if (post && !loading) document.title = `${post.title} · raquel.world`;
    return () => {
      document.title = "raquel.world";
    };
  }, [post, loading]);

  return (
    <main className="blog-page">
      <SiteNav activeSection="blog" className="blog-page__nav" />
      <article className="blog-page__inner blog-post">
        <Link to="/blog" className="nav-link blog-post__back">← All Posts</Link>

        {loading && <p className="blog-page__status">Loading…</p>}
        {!loading && error && <p className="blog-page__status">{error}</p>}
        {!loading && post && (
          <>
            <header className="blog-post__header">
              <h1 className="blog-post__title">{post.title}</h1>
              <time className="blog-card__date" dateTime={post.published_at}>
                {formatDate(post.published_at)}
              </time>
            </header>
            <Markdown>{post.body}</Markdown>
            {editId && (
              <footer className="blog-post__footer">
                <Link to={`/admin/posts/${editId}`} className="nav-link">Edit post</Link>
              </footer>
            )}
          </>
        )}
      </article>
    </main>
  );
}
