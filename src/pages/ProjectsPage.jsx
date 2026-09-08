import { Link, useNavigate } from "react-router-dom";
import "./ProjectsPage.css";

const projects = [
  {
    name: "DevFlow",
    desc: "A drag-and-drop CI/CD pipeline builder with real-time preview.",
    tags: ["React", "Node.js", "Docker"],
    color: "#FF6B6B",
    bg: "#FFF0F0",
  },
  {
    name: "Querycraft",
    desc: "Natural language to SQL converter powered by LLMs.",
    tags: ["Python", "FastAPI", "PostgreSQL"],
    color: "#4ECDC4",
    bg: "#F0FAFA",
  },
  {
    name: "Pixelboard",
    desc: "Collaborative pixel art canvas for teams. Real-time, multiplayer.",
    tags: ["WebSockets", "Canvas API", "Redis"],
    color: "#6d7eff",
    bg: "#d9dcf4",
  },
];

export default function ProjectsPage() {
  const navigate = useNavigate();

  const navItems = [
    { label: "home", href: "/" },
    { label: "projects", href: "/projects" },
    { label: "skills", href: "/" },
    { label: "socials", href: "/" },
  ];

  return (
    <main className="projects-page">
      <nav className="site-nav projects-page__nav">
        <span className="site-nav__logo">raquel fraktas</span>
        <div className="site-nav__links">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-link${item.label === "projects" ? " active" : ""}`}
              onClick={() => {
                if (item.label === "home") {
                  navigate("/", { state: { section: "home" } });
                  return;
                }

                if (item.label === "projects") {
                  navigate("/projects");
                  return;
                }

                navigate("/", { state: { section: item.label } });
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="projects-page__inner">
        <header className="projects-page__header">
          <div>
            <p className="section__label section__label--teal">Selected work</p>
            <h1 className="projects-page__title">Projects</h1>
          </div>
        </header>

        <div className="projects-grid">
          {projects.map((project) => (
            <article
              key={project.name}
              className="project-card"
              style={{ background: project.bg }}
            >
              <div className="project-card__swatch" style={{ background: project.color }} />
              <h2 className="project-card__name">{project.name}</h2>
              <p className="project-card__desc">{project.desc}</p>

              <div className="project-card__tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="project-card__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
