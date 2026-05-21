import { useState } from "react";
import "./neumorphic.css";

/**
 * NmToggle
 * Props:
 *   defaultOn  {boolean}  Initial state (default: false)
 *   onChange   {fn}       Called with the new boolean value on change
 *   label      {string}   Optional label shown to the left
 */
export default function NmToggle({ defaultOn = false, onChange, label }) {
  const [on, setOn] = useState(defaultOn);

  function toggle() {
    const next = !on;
    setOn(next);
    onChange?.(next);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      {label && <span className="nm-title" style={{ fontWeight: 400 }}>{label}</span>}
      <div
        className={`nm-toggle-track${on ? " nm-toggle-track--on" : ""}`}
        onClick={toggle}
        role="switch"
        aria-checked={on}
        tabIndex={0}
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && toggle()}
      >
        <div className="nm-toggle-thumb" />
      </div>
    </div>
  );
}
