
const color = "#be6affdd";
const skills = [
  { name: "TypeScript", color: color },
  { name: "React", color: color },
  { name: "Ruby on Rails", color: color },
  { name: "Python", color: color },
  { name: "Javascript", color: color },
  { name: "Datadog", color: color },
  { name: "PostgreSQL", color: color },
  { name: "Docker", color: color },
  { name: "AWS", color: color },
  { name: "Cloudflare", color: color },
  { name: "Redis", color: color },
];

export default function Skills() {
  return (
    <section id="skills">
      <div className="section__header">
        <span className="section__label section__label">// tools</span>
        <h2 className="section__heading">My stack</h2>
      </div>
      <div className="skills-grid">
        {skills.map((s) => (
          <div key={s.name} className="skill-pill">
            <span className="dot" style={{ background: s.color }} />
            {s.name}
          </div>
        ))}
      </div>
      <div className="stats-grid">
        {[
          { num: "4+", label: "Years experience", color: color },
          { num: "30+", label: "Projects shipped", color: color },
          { num: "∞", label: "Bugs fixed", color: color },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-card__num" style={{ color: s.color }}>{s.num}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}