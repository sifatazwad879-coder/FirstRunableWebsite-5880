import { useEffect, useRef } from "react";

/** Decorative mask only: never changes the image or intercepts hero controls. */
export function CursorReveal() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const hero = layer?.parentElement;
    if (!layer || !hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let visible = false;
    let frame = 0;
    let previousTime = 0;

    function paint() {
      layer!.style.setProperty("--reveal-x", `${current.x}px`);
      layer!.style.setProperty("--reveal-y", `${current.y}px`);
    }

    function animate(time: number) {
      frame = 0;
      if (!visible) return;
      const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16.67;
      previousTime = time;
      const easing = reducedMotion.matches ? 1 : 1 - Math.exp(-elapsed / 36);
      current.x += (target.x - current.x) * easing;
      current.y += (target.y - current.y) * easing;
      if (Math.hypot(target.x - current.x, target.y - current.y) < 0.1) {
        current.x = target.x;
        current.y = target.y;
        previousTime = 0;
      } else {
        frame = requestAnimationFrame(animate);
      }
      paint();
    }

    function move(event: PointerEvent) {
      // Touch scrolling must not leave a spotlight behind.
      if (event.pointerType !== "mouse") return;
      const bounds = hero!.getBoundingClientRect();
      target.x = event.clientX - bounds.left;
      target.y = event.clientY - bounds.top;
      if (!visible) {
        current.x = target.x;
        current.y = target.y;
        paint();
        visible = true;
        layer!.style.opacity = "1";
      }
      if (!frame) frame = requestAnimationFrame(animate);
    }

    function hide() {
      visible = false;
      layer!.style.opacity = "0";
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    }

    function visibilityChange() {
      if (document.hidden) hide();
    }

    hero.addEventListener("pointerenter", move);
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", hide);
    hero.addEventListener("pointercancel", hide);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", visibilityChange);
    return () => {
      hide();
      hero.removeEventListener("pointerenter", move);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", hide);
      hero.removeEventListener("pointercancel", hide);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", visibilityChange);
    };
  }, []);

  return (
    <div ref={layerRef} className="cursor-reveal" aria-hidden="true">
      <img className="hero-image" src="/images/hero-reveal-original.png" alt="" draggable={false} />
    </div>
  );
}