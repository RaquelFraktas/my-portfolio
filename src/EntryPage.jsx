import { useEffect, useState } from "react";
import "./EntryPage.css";
import DodgingImage from "./containers/DodgingImage";
import kellya from "./assets/kellyatransparent.png"
import "./neumorphic.css";


export default function EntryPage({ onEnter }) {
  const [showSpaceHint, setShowSpaceHint] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine)").matches) return;

    const timer = window.setTimeout(() => setShowSpaceHint(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

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
      {showSpaceHint && (
        <svg className="entry__space-hint" viewBox="0 0 400 120" aria-hidden="true">
          <path id="entry-space-hint-arc" d="M 24 100 Q 100 0 476 200" />
          <text>
            <textPath href="#entry-space-hint-arc" startOffset="50%" textAnchor="middle">
              press the spacebar... lol
            </textPath>
          </text>
        </svg>
      )}
      <DodgingImage
        src={kellya}
        alt="Enter"
        onCatch={onEnter}
      />
    </div>
    </>
  );
}
