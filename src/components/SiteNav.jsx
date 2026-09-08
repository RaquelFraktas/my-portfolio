import { useNavigate } from "react-router-dom";

export default function SiteNav({ activeSection = "home", className = "" }) {
  const navigate = useNavigate();
  const navItems = ["home", "projects", "skills", "socials"];

  function handleNavigate(section) {
    if (section === "projects") {
      navigate("/projects");
      return;
    }

    navigate("/", { state: { section } });
  }

  return (
    <nav className={`site-nav ${className}`.trim()}>
      <span className="site-nav__logo">raquel fraktas</span>
      <div className="site-nav__links">
        {navItems.map((item) => (
          <button
            key={item}
            className={`nav-link${activeSection === item ? " active" : ""}`}
            onClick={() => handleNavigate(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}
