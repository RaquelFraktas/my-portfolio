import { useState } from "react";
import SiteNav from "../components/SiteNav";
import MysteryGameProject from "../containers/MysteryGameProject";
import MatrixProject from "../containers/MatrixProject";
import NoSignalProject from "../containers/NoSignalProject";
import HorsesandDivorcesProject from "../containers/HorsesandDivorcesProject";
import "./ProjectsPage.css";
import ChromeExtensions from "../containers/ChromeExtensions";

const VIEW_STORAGE_KEY = "projects-view";
const views = [
  { id: "list", label: "One card per row", icon: "ti-layout-list" },
  { id: "grid", label: "Three cards per row", icon: "ti-layout-grid" },
];

function readSavedView() {
  try {
    return localStorage.getItem(VIEW_STORAGE_KEY) === "grid" ? "grid" : "list";
  } catch {
    return "list";
  }
}

export default function ProjectsPage() {
  const [view, setView] = useState(readSavedView);

  function changeView(nextView) {
    setView(nextView);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, nextView);
    } catch {
      // storage blocked (private mode etc.); the choice just won't persist
    }
  }

  return (
    <main className="projects-page">
      <SiteNav activeSection="projects" className="projects-page__nav" />
      
      <div className="projects-page__inner">
        <header className="projects-page__header">
          <div>
            <h2 className="projects-page__title">Projects</h2>
          </div>
          <div className="view-toggle" role="group" aria-label="Project layout">
            {views.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`view-toggle__btn${view === option.id ? " is-active" : ""}`}
                aria-pressed={view === option.id}
                aria-label={option.label}
                title={option.label}
                onClick={() => changeView(option.id)}
              >
                <i className={`ti ${option.icon}`} aria-hidden="true" />
              </button>
            ))}
          </div>
        </header>

        <div className={`projects-page__stack projects-page__stack--${view}`}>
          <MysteryGameProject/>
          <MatrixProject/>
          <NoSignalProject/>
          <HorsesandDivorcesProject/>
          <ChromeExtensions/>
        </div>
      </div>
    </main>
  );
}
