import { useState, useEffect } from "react";
import "./PersonalWebsite.css";
import Hero from "./Hero";
import Skills from "./Skills";
import Socials from "../components/Socials";
import "../neumorphic.css";


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
    color: "#6d7eff",
    bg: "#d9dcf4",
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
  { label: "LinkedIn", icon: "ti-brand-linkedin", href: "#" },
  { label: "Email", icon: "ti-mail", href: "mailto:raquel@example.com" },
];

export default function PersonalSite() {
  const [activeSection, setActiveSection] = useState("home");

  const navItems = ["home", "skills", "socials"];

  return (
    <div id="home" className="site-wrapper">

      {/* NAV */}
      <nav className="site-nav">
        <span className="site-nav__logo">
          raquel fraktas
        </span>
        <div className="site-nav__links">
          {navItems.map((s) => (
            <button
              key={s}
              className={`nav-link${activeSection === s ? " active" : ""}`}
              onClick={() => {
                setActiveSection(s);
                if (s === "home") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  return;
                }
                document.getElementById(s)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </nav>

      <Hero />
      <Skills />
      <Socials />

      <footer className="site-footer">
        built with <span className="site-footer__heart">♥</span> by raquel fraktas · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
