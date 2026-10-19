
const color = "#be6affdd";
// keep each group to 4 items max so it fits on one line
const skillGroups = [
  { skills: ["TypeScript", "JavaScript", "React"] },
  { skills: ["Ruby on Rails", "Python", "PostgreSQL", "Redis"] },
  { skills: ["AWS", "Docker", "Cloudflare", "Datadog"] },
];

export default function Skills() {
  return (
    <section id="skills">
      <div className="section__header">
        <span className="section__label">// tools</span>
      </div>
      <div className="skills-groups">
        {skillGroups.map((group) => (
          <div key={group.title} className="skills-group">
            <div className="skills-grid">
              {group.skills.map((name) => (
                <div key={name} className="skill-pill">
                  <span className="dot" style={{ background: color }} />
                  {name}
                </div>
              ))}
            </div>
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