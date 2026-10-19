import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PersonalWebsite.css";
import Hero from "./Hero";
import Skills from "./Skills";
import Socials from "../components/Socials";
import SiteNav from "../components/SiteNav";

export default function PersonalSite() {
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();

  useEffect(() => {
    const requestedSection = location.state?.section;
    if (!requestedSection) return;

    setActiveSection(requestedSection);

    if (requestedSection === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.getElementById(requestedSection);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.state]);

  return (
    <div id="home" className="site-wrapper">
      <SiteNav activeSection={activeSection} />

      <Hero />
      <Skills />
      <Socials />

      <footer className="site-footer">
        raquel fraktas · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
