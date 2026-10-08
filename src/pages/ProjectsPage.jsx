import SiteNav from "../components/SiteNav";
import MatrixProject from "../containers/MatrixProject";
import HorsesandDivorcesProject from "../containers/HorsesandDivorcesProject";
import "./ProjectsPage.css";
import TypeaheadPage from "./TypeaheadPage";

export default function ProjectsPage() {
  return (
    <main className="projects-page">
      <SiteNav activeSection="projects" className="projects-page__nav" />
      
      <div className="projects-page__inner">
        <header className="projects-page__header">
          <div>
            <p className="section__label">// selected work</p>
            <h1 className="projects-page__title">Projects</h1>
          </div>
        </header>

        <div className="projects-page__stack">
          <MatrixProject/>
          <HorsesandDivorcesProject/>
          <TypeaheadPage/>
        </div>
      </div>
    </main>
  );
}
