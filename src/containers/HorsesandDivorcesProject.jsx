import horsesAndDivorcesImage from "../assets/horsesanddivorces.png";

export default function HorsesandDivorces() { 
  return (
    <section className="project-feature project-feature--game">
      <div className="project-feature__copy">
        <p className="section__label">Game</p>
        <h2 className="project-feature__title">Horses and Divorces</h2>
        <p className="project-feature__description">
          A very serious game about marriages and number-guessing built in collaboration with the Wikimedia Foundation. Built during the Wikimedia Hackathon. This game hits the Wikipedia API for its content.
        </p>
        <p className="project-tech">
          <span className="stack-title">Stack used:</span>
          <span className="stack-items">
            Ruby on Rails, React, Next.js, Typescript, Twitch.io, Wikipedia API
          </span>
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
  );
}