import { useState, useEffect } from "react";
import kellyaLaptop from "./../assets/kellya-laptop.png"
import "./Hero.css";

const roles = ["Full-Stack Developer", "DJ", "Lover... Not a Fighter"];

export default function Hero() {

  const [roleIdx, setRoleIdx] = useState(0);
  const [displayedRole, setDisplayedRole] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const role = roles[roleIdx];
    if (typing) {
      if (displayedRole.length < role.length) {
        const t = setTimeout(() => setDisplayedRole(role.slice(0, displayedRole.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (displayedRole.length > 0) {
        const t = setTimeout(() => setDisplayedRole(displayedRole.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setRoleIdx((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }
  }, [displayedRole, typing, roleIdx]);

  return (
    <section className="hero">
      <div className="blob" style={{ width: 400, height: 400, background: "#93f8e7", left: 150 }} />
      <div className="hero__content">
        <h1 className="hero__name">Raquel</h1>
        <div className="hero__role">
          <span className="hero__role-text">{displayedRole}</span>
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
      <img
        src={kellyaLaptop}
        alt="hero__img"
        className="hero-image"
      />
    </section>
  )
}