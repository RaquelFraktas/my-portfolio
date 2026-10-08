import noSignalImage from "../assets/nosignal.png";

export default function NoSignalProject() {
  return (
    <section className="project-feature project-feature--game">
      <a
        className="project-feature__thumb-link"
        href="https://www.nosignalnyc.com/"
        target="_blank"
        rel="noreferrer"
        aria-label="Visit the No Signal website"
      >
        <img
          className="project-feature__thumb"
          src={noSignalImage}
          alt="No Signal thumbnail"
        />
      </a>

      <div className="project-feature__copy">
        <p className="section__label">Website</p>
        <h2 className="project-feature__title">No Signal</h2>
        <p className="project-feature__description">
          NO SIGNAL NYC is an independent electronic music platform, party series, and radio-style broadcast collective in New York City focused on underground techno, trance, house, and experimental ambient music.
        </p>
        <p className="project-tech">
          <span className="stack-title">Stack used:</span>
          <span className="stack-items">
            React, Next.js, Typescript, Vercel, React Native, Sanity, and Tailwind CSS
          </span>
        </p>
        <a
          className="project-feature__link"
          href="https://www.nosignalnyc.com/"
          target="_blank"
          rel="noreferrer"
        >
          Visit the Site
        </a>
      </div>
    </section>
  );
} 
        