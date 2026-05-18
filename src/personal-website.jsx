import { useState, useEffect } from "react";
import "./personal-website.css";

const roles = ["Full-Stack Developer", "DJ", "Lover... Not a Fighter"];

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

const skills = [
  { name: "TypeScript", color: "#3178C6" },
  { name: "React", color: "#61DAFB" },
  { name: "Node.js", color: "#339933" },
  { name: "Python", color: "#3776AB" },
  { name: "Go", color: "#00ADD8" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "Docker", color: "#2496ED" },
  { name: "AWS", color: "#FF9900" },
  { name: "GraphQL", color: "#E10098" },
  { name: "Redis", color: "#DC382D" },
];

const socials = [
  { label: "GitHub", icon: "ti-brand-github", href: "#" },
  { label: "Twitter", icon: "ti-brand-twitter", href: "#" },
  { label: "LinkedIn", icon: "ti-brand-linkedin", href: "#" },
  { label: "Email", icon: "ti-mail", href: "mailto:raquel@example.com" },
];

export default function PersonalSite() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const role = roles[roleIdx];
    if (typing) {
      if (displayed.length < role.length) {
        const t = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setRoleIdx((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, roleIdx]);

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

      {/* HERO */}
      <section id="home" className="hero">
        <div className="blob" style={{ width: 400, height: 400, background: "#FF6B6B", top: -80, right: -80 }} />
        <div className="blob" style={{ width: 300, height: 300, background: "#4ECDC4", bottom: -60, left: -40 }} />
        <div className="blob" style={{ width: 200, height: 200, background: "#FFE66D", top: 60, left: "40%" }} />

        <div className="hero__content">
          <div className="hero__greeting">👋 hey there, i'm</div>
          <h1 className="hero__name">Raquel Fraktas</h1>
          <div className="hero__role">
            <span className="hero__role-text">{displayed}</span>
            <span className="cursor" />
          </div>
          <p className="hero__bio">
            I build things for the web — from elegant APIs to delightful UIs. Passionate about developer tooling, distributed systems, and making complex things feel simple.
          </p>
          <div className="hero__actions">
            <button className="cta-btn cta-btn--dark" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
              View my work <i className="ti ti-arrow-right" />
            </button>
            <button className="cta-btn cta-btn--outline" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
              Get in touch
            </button>
          </div>
        </div>
      </section>

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

      {/* SKILLS */}
      <section id="skills">
        <div className="section__header">
          <span className="section__label section__label--teal">// tools of the trade</span>
          <h2 className="section__heading">My stack</h2>
        </div>
        <div className="skills-grid">
          {skills.map((s) => (
            <div key={s.name} className="skill-pill">
              <span className="dot" style={{ background: s.color }} />
              {s.name}
            </div>
          ))}
        </div>
        <div className="stats-grid">
          {[
            { num: "4+", label: "Years experience", color: "#FF6B6B" },
            { num: "30+", label: "Projects shipped", color: "#4ECDC4" },
            { num: "12k+", label: "GitHub stars", color: "#FFE66D" },
            { num: "∞", label: "Bugs fixed", color: "#A29BFE" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-card__num" style={{ color: s.color }}>{s.num}</div>
              <div className="stat-card__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section--full-width section--white">
        <div className="section__inner">
          <div className="section__header">
            <span className="section__label section__label--purple">// let's talk</span>
            <h2 className="section__heading">Get in touch</h2>
            <p style={{ color: "#666", fontSize: 16, marginTop: 12, lineHeight: 1.6 }}>Open to new opportunities, collaborations, or just a chat about tech.</p>
          </div>
          <div className="contact-form__row">
            <input type="text" placeholder="Your name" />
            <input type="email" placeholder="Your email" />
          </div>
          <textarea placeholder="What's on your mind?" rows={5} />
          <button className="cta-btn cta-btn--dark">
            Send message <i className="ti ti-send" />
          </button>
          <div className="social-links">
            {socials.map((s) => (
              <a key={s.label} href={s.href} className="social-btn">
                <i className={`ti ${s.icon}`} style={{ fontSize: 18 }} />
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        built with <span className="site-footer__heart">♥</span> by raquel fraktas · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
