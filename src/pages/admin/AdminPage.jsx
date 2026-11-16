import SiteNav from "../../components/SiteNav";
import "../BlogPage.css";
import "./Admin.css";

// Same shell as the blog pages: site nav on top, content in the blog column.
export default function AdminPage({ children }) {
  return (
    <main className="blog-page admin">
      <SiteNav activeSection="admin" className="blog-page__nav" />
      <div className="blog-page__inner">{children}</div>
    </main>
  );
}
