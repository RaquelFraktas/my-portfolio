import { useEffect, useId, useRef, useState } from "react";

// finished chrome extensions
const chromeExtensions = [
  {
    name: "Italian Subtitles Injector", // TODO: real name
    type: "Chrome extension",
    description: "A Chrome extension that finds Italian subtitles on OpenSubtitles and adds them to the video you're watching, on any site with an HTML5 <video> player. I had a boyfriend where English wasn't his first language, and I wanted to watch movies with him, so I built this extension to make it easier to find Italian subtitles for any movie.",
  },
  {
    name: "YouTube Ads Skipper", // TODO: real name
    type: "Chrome extension",
    description: "Don't like spending money on subscriptions? This extension skips YouTube ads for you.",
  },
];

export default function ChromeExtensions() {
  return (
    <section className="project-feature project-feature--extensions">
      <div className="project-feature__copy">
        <p className="section__label">Browser tools</p>
        <h2 className="project-feature__title">Chrome Extensions</h2>
        <p className="project-feature__description">
          Extensions I've built for Chrome.
        </p>
      </div>

      <ul className="extension-list">
        {chromeExtensions.map((extension) => (
          <ExtensionItem key={extension.name} extension={extension} />
        ))}
      </ul>
    </section>
  );
}

function ExtensionItem({ extension }) {
  const descriptionRef = useRef(null);
  const descriptionId = useId();
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);

  // only offer "read more" when the text is actually cut off; re-check when the tile resizes
  useEffect(() => {
    const el = descriptionRef.current;
    function measure() {
      setFullHeight(el.scrollHeight);
      setOverflowing(el.scrollHeight > el.clientHeight + 1 || el.classList.contains("is-expanded"));
    }
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <li className="extension-item">
      <div className="extension-item__header">
        <h3 className="extension-item__name">{extension.name}</h3>
        <span className="extension-item__badge">
          <i className="ti ti-brand-chrome" aria-hidden="true" />
          {extension.type}
        </span>
      </div>
      <p
        ref={descriptionRef}
        id={descriptionId}
        className={`extension-item__description${expanded ? " is-expanded" : ""}${overflowing && !expanded ? " is-clamped" : ""}`}
        style={expanded ? { maxHeight: fullHeight } : undefined}
      >
        {extension.description}
      </p>
      {overflowing && (
        <button
          type="button"
          className="extension-item__toggle"
          aria-expanded={expanded}
          aria-controls={descriptionId}
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? "Read less" : "Read more"}
          <i className={`ti ti-chevron-${expanded ? "up" : "down"}`} aria-hidden="true" />
        </button>
      )}
    </li>
  );
}
