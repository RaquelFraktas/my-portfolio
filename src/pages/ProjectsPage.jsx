import SiteNav from "../components/SiteNav";
import MysteryGameProject from "../containers/MysteryGameProject";
import MatrixProject from "../containers/MatrixProject";
import NoSignalProject from "../containers/NoSignalProject";
import HorsesandDivorcesProject from "../containers/HorsesandDivorcesProject";
import "./ProjectsPage.css";
import ChromeExtensions from "../containers/ChromeExtensions";

export default function ProjectsPage() {
  return (
    <main className="projects-page">
      <SiteNav activeSection="projects" className="projects-page__nav" />
      
      <div className="projects-page__inner">
        <header className="projects-page__header">
          <div>
            <h2 className="projects-page__title">Projects</h2>
          </div>
        </header>

        <div className="projects-page__stack">
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
