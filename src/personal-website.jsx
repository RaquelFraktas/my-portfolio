import { useState, useEffect } from "react";
import "./personal-website.css";
import Contact from "./containers/Contact";
import Hero from "./containers/Hero";
import Skills from "./containers/Skills";

const projects = [
  {
    name: "DevFlow",
    desc: "A drag-and-drop CI/CD pipeline builder with real-time preview.",
    tags: ["React", "Node.js", "Docker"],
    color: "#FF6B6B",
    bg: "#FFF0F0",
    link: "#",
  },
  {
    name: "Querycraft",
    desc: "Natural language to SQL converter powered by LLMs.",
    tags: ["Python", "FastAPI", "PostgreSQL"],
    color: "#4ECDC4",
    bg: "#F0FAFA",
    link: "#",
  },
  {
    name: "Pixelboard",
    desc: "Collaborative pixel art canvas for teams. Real-time, multiplayer.",
    tags: ["WebSockets", "Canvas API", "Redis"],
    color: "#FFE66D",
    bg: "#FFFBEA",
    link: "#",
  },
  {
    name: "Logsmith",
    desc: "Structured logging library with zero-config observability dashboards.",
    tags: ["TypeScript", "Go", "Grafana"],
    color: "#A29BFE",
    bg: "#F3F2FF",
    link: "#",
  },
];

const socials = [
  { label: "GitHub", icon: "ti-brand-github", href: "#" },
  { label: "Twitter", icon: "ti-brand-twitter", href: "#" },
  { label: "LinkedIn", icon: "ti-brand-linkedin", href: "#" },
  { label: "Email", icon: "ti-mail", href: "mailto:raquel@example.com" },
];

export default function PersonalSite() {
  const [activeSection, setActiveSection] = useState("home");

  const navItems = ["home", "projects", "skills", "contact"];

  return (
    <div className="site-wrapper">

      {/* NAV */}
      <nav className="site-nav">
        <span className="site-nav__logo">
          <span className="site-nav__logo-accent">&lt;</span>raquel<span className="site-nav__logo-accent">/&gt;</span>
        </span>
        <div className="site-nav__links">
          {navItems.map((s) => (
            <button
              key={s}
              className={`nav-link${activeSection === s ? " active" : ""}`}
              onClick={() => { setActiveSection(s); document.getElementById(s)?.scrollIntoView({ behavior: "smooth" }); }}
            >
              {s}
            </button>
          ))}
        </div>
      </nav>

      <Hero />

      {/* PROJECTS */}
      <section id="projects" className="section--full-width section--white">
        <div className="section__inner">
          <div className="section__header">
            <span className="section__label section__label--red">// selected work</span>
            <h2 className="section__heading">Things I've built</h2>
          </div>
          <div className="projects-grid">
            {projects.map((p) => (
              <div key={p.name} className="proj-card">
                <div
                  className="proj-card__icon"
                  style={{ background: p.bg, border: `1.5px solid ${p.color}30` }}
                >
                  <i className="ti ti-code" style={{ color: p.color }} />
                </div>
                <h3 className="proj-card__name">{p.name}</h3>
                <p className="proj-card__desc">{p.desc}</p>
                <div className="proj-card__tags">
                  {p.tags.map((t) => (
                    <span key={t} className="tag" style={{ background: p.bg, color: p.color, border: `1px solid ${p.color}40` }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Skills />
      <Contact />

      <footer className="site-footer">
        built with <span className="site-footer__heart">♥</span> by raquel fraktas · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
