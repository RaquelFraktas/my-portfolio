import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import AdminPage from "./AdminPage";

// The real gate is the Worker's session check on every /api/admin call; this
// only decides what to show.
export default function AdminLayout() {
  const navigate = useNavigate();
  const [me, setMe] = useState({ status: "loading" });

  useEffect(() => {
    api
      .me()
      .then((data) => setMe({ status: "ok", username: data.username }))
      .catch(() => setMe({ status: "denied" }));
  }, []);

  async function signOut() {
    try {
      await api.logout();
    } finally {
      navigate("/admin/login", { replace: true });
    }
  }

  if (me.status === "loading") {
    return <AdminPage><p className="blog-page__status">Checking access…</p></AdminPage>;
  }
  if (me.status === "denied") return <Navigate to="/admin/login" replace />;

  return (
    <AdminPage>
      <header className="admin__bar">
        <span className="admin__muted">signed in as {me.username}</span>
        <div className="admin__actions">
          <Link to="/blog" className="nav-link">view blog</Link>
          <button type="button" className="nav-link" onClick={signOut}>sign out</button>
        </div>
      </header>
      <Outlet />
    </AdminPage>
  );
}
