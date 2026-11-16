import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import { api, formatDate } from "../lib/api";
import "./BlogPage.css";

export default function BlogPage() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .listPosts()
      .then((data) => !cancelled && setPosts(data.posts))
      .catch(() => !cancelled && setError("Couldn't load posts right now."));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="blog-page">
      <SiteNav activeSection="blog" className="blog-page__nav" />
      <div className="blog-page__inner">
        <header className="blog-page__header">
          <h2 className="blog-page__title">Blog</h2>
        </header>

        {error && <p className="blog-page__status">{error}</p>}
        {!error && posts === null && <p className="blog-page__status">Loading…</p>}
        {posts?.length === 0 && <p className="blog-page__status">No posts yet.</p>}

        <ul className="blog-list">
          {posts?.map((post) => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`} className="blog-card">
                <time className="blog-card__date" dateTime={post.published_at}>
                  {formatDate(post.published_at)}
                </time>
                <h3 className="blog-card__title">{post.title}</h3>
                {post.summary && <p className="blog-card__summary">{post.summary}</p>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
