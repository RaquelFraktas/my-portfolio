import { useState, useRef, useEffect } from "react";
import EntryPage from "./EntryPage";
import PersonalSite from "./personal-website";

export default function App() {
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const entryRef = useRef(null);
  const hasEnteredRef = useRef(false);

  function handleEnter() {
    if (hasEnteredRef.current) return;
    hasEnteredRef.current = true;
    setExiting(true);
    setTimeout(() => setEntered(true), 650);
  }
  
  useEffect(() => {
    function onKeyDown(e) {
      if (e.code === "Space") {
        e.preventDefault();
        handleEnter();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (entered) return <PersonalSite />;

  return (
    <div
      ref={entryRef}
      className={exiting ? "entry--exiting" : ""}
    >
      <EntryPage onEnter={handleEnter} />
    </div>
  );
}
