import matrixGameImage from "../assets/matrix-highscore-page.png";

export default function MatrixProject() {
  return (
    <section className="project-feature project-feature--game">
      <div className="project-feature__copy">
        <p className="section__label">Game</p>
        <h2 className="project-feature__title">Matrix Tag</h2>
        <p className="project-feature__description">
          A game where users tag each other in real-time based on a QR code.
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