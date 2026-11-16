import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import AdminPage from "./AdminPage";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.login(username, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminPage>
      <form className="admin__login" onSubmit={handleSubmit}>
        <h2 className="blog-page__title">Sign in</h2>

        <label className="admin__field">
          <span>Username</span>
          <input
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label className="admin__field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="admin__error" role="alert">{error}</p>}

        <button type="submit" className="nav-link" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AdminPage>
  );
}
