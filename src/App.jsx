import { useState, useRef, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import EntryPage from "./EntryPage";
import PersonalSite from "./containers/PersonalWebsite";
import ProjectsPage from "./pages/ProjectsPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPostList from "./pages/admin/AdminPostList";
import AdminPostEditor from "./pages/admin/AdminPostEditor";

export default function App() {
  const { pathname } = useLocation();
  // The intro screen only greets visitors who land on the homepage. Deep links
  // (/projects, /blog/..., /admin) go straight to their page. This is decided
  // once on first load, so navigating back to "/" later doesn't show it again.
  const [entered, setEntered] = useState(() => pathname !== "/");
  const [exiting, setExiting] = useState(false);
  const entryRef = useRef(null);
  const hasEnteredRef = useRef(false);

  function handleEnter() {
    if (hasEnteredRef.current) return;
    hasEnteredRef.current = true;
    setExiting(true);
    setTimeout(() => setEntered(true), 650);
  }

  // Space only means "enter" on the intro screen; afterwards it must reach
  // inputs (admin editor) and scrolling as normal.
  useEffect(() => {
    if (entered) return;
    function onKeyDown(e) {
      if (e.code === "Space") {
        e.preventDefault();
        handleEnter();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [entered]);

  if (!entered) {
    return (
      <div
        ref={entryRef}
        className={exiting ? "entry--exiting" : ""}
      >
        <EntryPage onEnter={handleEnter} />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<PersonalSite />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPostList />} />
        <Route path="new" element={<AdminPostEditor />} />
        <Route path="posts/:id" element={<AdminPostEditor />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
