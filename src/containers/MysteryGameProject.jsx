import MysteryGameImage from "../assets/mysterygame.png";

export default function MysteryGameProject() {
  return (
    <section className="project-feature project-feature--game">
      <a
        className="project-feature__thumb-link"
        href="https://mystery-game-mauve.vercel.app/"
        target="_blank"
        rel="noreferrer"
        aria-label="Play the game"
      >
        <img
          className="project-feature__thumb"
          src={MysteryGameImage}
          alt="Mystery Game thumbnail"
        />
      </a>

      <div className="project-feature__copy">
        <p className="section__label">Game</p>
        <h2 className="project-feature__title">Escape the Room</h2>
        <p className="project-feature__description">
         A text-based escape room. The player types whatever they'd actually try; the room responds. 
         <br/><br/>
          The cool thing about this game is that it uses Jev, a LLM that is a specialized at decision-making, to generate the room's responses, so the player can try anything they want and the room will respond in a way that makes sense.
        </p>
        <p className="project-feature__description">
          I wanted to take Jev out for a spin, and this is a fun way to do it. Jev is cheaper compared to text-based LLMs. Instead of recieving a text response, it recieves a possible list of actions, and chooses the best one based on probability scores.
        </p>
        <p className="project-tech">
          <span className="stack-title">Stack used:</span>
          <span className="stack-items">
            JavaScript, Node.js, Jev AI, and Vercel
          </span>
        </p>
        <a
          className="project-feature__link"
          href="https://mystery-game-mauve.vercel.app/"
          target="_blank"
          rel="noreferrer"
        >
          Play the Game
        </a>
      </div>
    </section>
  );
} 
        