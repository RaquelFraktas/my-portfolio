const skills = [
  { name: "TypeScript", color: "#3178C6" },
  { name: "React", color: "#61DAFB" },
  { name: "Node.js", color: "#339933" },
  { name: "Python", color: "#3776AB" },
  { name: "Go", color: "#00ADD8" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "Docker", color: "#2496ED" },
  { name: "AWS", color: "#FF9900" },
  { name: "GraphQL", color: "#E10098" },
  { name: "Redis", color: "#DC382D" },
];

export default function Skills() {
  return (
    <section id="skills">
      <div className="section__header">
        <span className="section__label section__label--teal">// tools of the trade</span>
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
          { num: "4+", label: "Years experience", color: "#FF6B6B" },
          { num: "30+", label: "Projects shipped", color: "#4ECDC4" },
          { num: "12k+", label: "GitHub stars", color: "#FFE66D" },
          { num: "∞", label: "Bugs fixed", color: "#A29BFE" },
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