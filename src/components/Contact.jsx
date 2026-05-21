const socials = [
  { label: "GitHub", icon: "ti-brand-github", href: "https://github.com/RaquelFraktas" },
  { label: "LinkedIn", icon: "ti-brand-linkedin", href: "https://www.linkedin.com/in/raquelfraktas/" },
  { label: "Email", icon: "ti-mail", href: "mailto:send_me_on_linked_in@raquelfraktas.com" },
];

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="section__inner">
        <div className="section__header">
          <span className="section__label section__label--purple">// let's talk</span>
          <h2 className="section__heading">Get in touch</h2>
          <p style={{ color: "#666", fontSize: 16, marginTop: 12, lineHeight: 1.6 }}>Open to new opportunities, collaborations, or just a chat about tech.</p>
      </div>
      <div className="contact-form__row">
        <input type="text" placeholder="Your name" />
        <input type="email" placeholder="Your email" />
      </div>
      <textarea placeholder="What's on your mind?" rows={5} />
      <button className="cta-btn cta-btn--dark">
        Send message <i className="ti ti-send" />
      </button>
      <div className="social-links">
        {socials.map((s) => (
          <a key={s.label} href={s.href} className="social-btn">
            <i className={`ti ${s.icon}`} style={{ fontSize: 18 }} />
            {s.label}
          </a>
        ))}
      </div>
    </div>
  </section>
  )
};