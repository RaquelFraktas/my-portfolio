import "./EntryPage.css";
import DodgingImage from "./DodgingImage";
import kellya from "./assets/kellya.jpg"

export default function EntryPage({ onEnter }) {
  return (
    <>
    <div className="entry">
      <div className="entry__content">
        <span className="entry__year">© {new Date().getFullYear()} — stuff</span>
        <h1 className="entry__name">
          RAQUEL.WORLD
        </h1>
          click the image to enter
      </div>
      <DodgingImage
        src={kellya}
        alt="Enter"
        onCatch={onEnter}
      />
    </div>
    </>
  );
}
