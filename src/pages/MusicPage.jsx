import "./MusicPage.css";
import DancingMan from "./DancingMan";

const youtubeAudioUrl = "https://www.youtube.com/embed/SvfoGIX-Tis?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0";

export default function MusicPage() {
  return (
    <section className="music-page">
      <div className="music-page__card">
        <div className="music-page__copy">
          <h3 className="music-page__description">
            Thing I'm currently listening to.
          </h3>
        </div>

        <div className="music-page__player-wrap">
          <iframe
            className="music-page__player"
            src={youtubeAudioUrl}
            title="YouTube audio player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen={false}
          />
        </div>
        <DancingMan />
      </div>
    </section>
  );
}