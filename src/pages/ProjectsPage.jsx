import SiteNav from "../components/SiteNav";
import CloudShader from "../components/CloudShader";
import MusicPage from "./MusicPage";
import horsesAndDivorcesImage from "../assets/horsesanddivorces.png";
import "./ProjectsPage.css";
import TypeaheadPage from "./TypeaheadPage";

export default function ProjectsPage() {
  return (
    <main className="projects-page">
      <div className="projects-page__shader">
        <CloudShader style={{ position: "absolute", inset: 0, zIndex: 0 }} />
      </div>

      <SiteNav activeSection="projects" className="projects-page__nav" />

      <div className="projects-page__inner">
        <header className="projects-page__header">
          <div>
            <p className="section__label section__label--teal">Selected work</p>
            <h1 className="projects-page__title">Projects</h1>
          </div>
        </header>

        <div className="projects-page__stack">
          <MusicPage />

          <section className="project-feature project-feature--game">
            <div className="project-feature__copy">
              <p className="section__label section__label--red">Game</p>
              <h2 className="project-feature__title">Horses and Divorces</h2>
              <p className="project-feature__description">
                A very serious game about marriages and number-guessing built in collaboration with the Wikimedia Foundation.
              </p>
              <a
                className="project-feature__link"
                href="https://teamwikipedia.itch.io/horses-and-divorces"
                target="_blank"
                rel="noreferrer"
              >
                Play the game
              </a>
            </div>

            <a
              className="project-feature__thumb-link"
              href="https://teamwikipedia.itch.io/horses-and-divorces"
              target="_blank"
              rel="noreferrer"
              aria-label="Play Horses and Divorces on itch.io"
            >
              <img
                className="project-feature__thumb"
                src={horsesAndDivorcesImage}
                alt="Horses and Divorces game thumbnail"
              />
            </a>
          </section>
          <TypeaheadPage/>

        </div>
      </div>
    </main>
  );
}
