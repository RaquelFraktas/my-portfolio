import { useState } from "react";

const socials = [
  { label: "GitHub", icon: "ti-brand-github", href: "https://github.com/RaquelFraktas" },
  { label: "LinkedIn", icon: "ti-brand-linkedin", href: "https://www.linkedin.com/in/raquelfraktas/" },
  { label: "Email", icon: "ti-mail", href: "mailto:send_me_on_linked_in@raquelfraktas.com" },
];

export default function Contact() {


  return (
    <section id="socials" className="section">
      <div className="social-links">
        {socials.map((s) => (
          <a key={s.label} href={s.href} className="social-btn">
            <i className={`ti ${s.icon}`} style={{ fontSize: 18 }} />
            {s.label}
          </a>
        ))}
      </div>
    </section>
  );
}