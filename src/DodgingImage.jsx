import { useEffect, useRef } from "react";

const DODGE_RADIUS = 160;

export default function DodgingImage({ src, alt = "Enter", onCatch, size = 160 }) {
  const imgRef = useRef(null);
  const posRef = useRef({ x: null, y: null });
  const targetRef = useRef({ x: null, y: null });
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);
  const hasDodgedRef = useRef(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight - size;

    posRef.current = { x: cx, y: cy };
    targetRef.current = { x: cx, y: cy };

    function onMouseMove(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", onMouseMove);

    function randomPos(excludeX, excludeY) {
      const pad = size;
      const w = window.innerWidth;
      const h = window.innerHeight;
      let x, y, attempts = 0;
      do {
        x = pad + Math.random() * (w - pad * 2);
        y = pad + Math.random() * (h - pad * 2);
        attempts++;
      } while (
        attempts < 20 &&
        Math.hypot(x - excludeX, y - excludeY) < DODGE_RADIUS * 1.5
      );
      return { x, y };
    }

    function tick() {
      const pos = posRef.current;
      const mouse = mouseRef.current;

      const dist = Math.hypot(mouse.x - pos.x, mouse.y - pos.y);
      if (dist < DODGE_RADIUS) {
        targetRef.current = randomPos(mouse.x, mouse.y);
        if (!hasDodgedRef.current) {
          hasDodgedRef.current = true;
        }
      }
      const ease = 0.09;

      pos.x += (targetRef.current.x - pos.x) * ease;
      pos.y += (targetRef.current.y - pos.y) * ease;

      const half = size / 2;
      pos.x = Math.max(half, Math.min(window.innerWidth - half, pos.x));
      pos.y = Math.max(half, Math.min(window.innerHeight - half, pos.y));

      img.style.left = `${pos.x}px`;
      img.style.top = `${pos.y}px`;

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="dodging-image__stage">
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="dodging-image__img"
        style={{ width: size }}
        onClick={onCatch}
      />
    </div>
  );
}