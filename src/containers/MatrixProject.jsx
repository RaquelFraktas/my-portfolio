import matrixGameImage from "../assets/matrix-highscore-page.png";

export default function MatrixProject() {
  return (
    <section className="project-feature project-feature--game">
      <div className="project-feature__copy">
        <p className="section__label">Game</p>
        <h2 className="project-feature__title">Down the Rabbit Hole</h2>
        <p className="project-feature__description">
          A Matrix-inspired game of tag built with Ruby on Rails, Hotwire/Stimulus and Turbo. 
          Every player gets a unique QR code that other players can scan to make a kill. 
          Stay alive, rack up kills, and watch your status change as the game unfolds. Red pill or blue pill? 
          Either way, you're in the system now.
        </p>
        <p className="project-tech">
          <span className="stack-title">Stack used:</span>
          <span className="stack-items">
            Ruby on Rails, Hotwire/Stimulus, Turbo, Redis, PostgreSQL, Heroku, and rqrcode for qr generation
          </span>
        </p>
        <a
          className="project-feature__link"
          href="https://downtherabbithole-6614b2c776e9.herokuapp.com/"
          target="_blank"
          rel="noreferrer"
        >
          Play the game
        </a>
      </div>

      <a
        className="project-feature__thumb-link"
        href="https://downtherabbithole-6614b2c776e9.herokuapp.com/"
        target="_blank"
        rel="noreferrer"
        aria-label="Play downtherabbithole"
      >
        <img
          className="project-feature__thumb"
          src={matrixGameImage}
          alt="Matrix Tag game thumbnail"
        />
      </a>


    </section>
  );
} 