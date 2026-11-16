import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, formatDate } from "../../lib/api";

export default function AdminPostList() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .adminListPosts()
      .then((data) => setPosts(data.posts))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <div className="admin__row">
        <h2 className="blog-page__title">Posts</h2>
        <Link to="/admin/new" className="nav-link">New post</Link>
      </div>

      {error && <p className="admin__error">{error}</p>}
      {!error && posts === null && <p className="blog-page__status">Loading…</p>}
      {posts?.length === 0 && <p className="blog-page__status">No posts yet. Write your first one!</p>}

      <ul className="blog-list">
        {posts?.map((post) => (
          <li key={post.id}>
            <Link to={`/admin/posts/${post.id}`} className="blog-card admin__item">
              <span className={`admin__badge admin__badge--${post.status}`}>{post.status}</span>
              <h3 className="blog-card__title">{post.title}</h3>
              <span className="blog-card__date">
                {post.published_at ? formatDate(post.published_at) : `edited ${formatDate(post.updated_at)}`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
