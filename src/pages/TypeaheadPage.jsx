import { useEffect, useMemo, useState } from "react";
import SiteNav from "../components/SiteNav";
import "./TypeaheadPage.css";

const TRENDING_QUERIES = [
  "raquel is amazingggg",
  "what is the meaning to life",
  "am i penagnt"
];

const GOOGLE_SEARCH_URL = "https://www.google.com/search?q=";

export default function TypeaheadPage() {
  const [input, setInput] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const normalized = TRENDING_QUERIES.map((query) => query.trim()).filter(Boolean);
    setTrending(normalized);
  }, []);

  const suggestions = useMemo(() => {
    const value = input.trim().toLowerCase();

    if (!value) {
      return trending;
    }

    return trending.filter((query) => query.toLowerCase().includes(value));
  }, [input, trending]);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(suggestions.length - 1, 0)));
  }, [suggestions.length]);

  function openSearch(query) {
    const sanitized = query.trim();
    if (!sanitized) return;
    window.open(`${GOOGLE_SEARCH_URL}${encodeURIComponent(sanitized)}`, "_blank", "noopener,noreferrer");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const query = suggestions[activeIndex] ?? input.trim();
    openSearch(query);
  }

  function handleKeyDown(event) {
    if (!suggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length);
    }

    if (event.key === "Enter") {
      event.preventDefault();
      openSearch(suggestions[activeIndex] ?? input);
    }
  }

  return (
    <section className="project-feature project-feature--typeahead">

      <div className="typeahead-page__inner">
        <p className="typeahead-page__label">Systems design</p>
        <h2 className="typeahead-page__title">Typeahead</h2>

        <div className="typeahead-page__panel">
          <form className="typeahead-form" onSubmit={handleSubmit}>
            <label className="typeahead-search" aria-label="Search the web">
              <span className="typeahead-search__icon">⌕</span>
              <input
                className="typeahead-search__input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search bingbong"
              />
              <button type="submit" className="typeahead-search__button">
                Search
              </button>
            </label>

            <ul className="typeahead-list" role="listbox" aria-label="Search suggestions">
              {suggestions.map((query, index) => (
                <li key={query}>
                  <button
                    type="button"
                    className={`typeahead-item ${index === activeIndex ? "is-active" : ""}`}
                    onMouseDown={() => openSearch(query)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <span className="typeahead-item__text">
                      <span aria-hidden="true">↗</span>
                      {query}
                    </span>
                    <span className="typeahead-item__badge"> {"Trending <333"}</span>
                  </button>
                </li>
              ))}
            </ul>
          </form>
        </div>
      </div>
    </section>
  );
}
