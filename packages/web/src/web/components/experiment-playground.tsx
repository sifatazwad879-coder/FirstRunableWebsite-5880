import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, Shuffle } from "lucide-react";

const studies = [
  {
    name: "AI",
    title: "Latent topographies",
    subtitle: "An algorithmic study of imagined terrain.",
    hint: "Move the cursor to bend the contour field.",
    note: "Procedural visualization inspired by AI latent spaces — no live AI model is called.",
  },
  {
    name: "3D",
    title: "Orbital geometry",
    subtitle: "A form suspended between order and chaos.",
    hint: "Move the cursor to rotate the wireframe sphere.",
    note: "Live mathematical 3D projection rendered in the browser.",
  },
  {
    name: "Motion",
    title: "Echoes in orbit",
    subtitle: "Every movement leaves a little memory.",
    hint: "Move the cursor to shift the center of motion.",
    note: "A live orbital motion study with layered light trails.",
  },
  {
    name: "Web",
    title: "Connected by chance",
    subtitle: "An interface without a fixed beginning.",
    hint: "Move the cursor to attract the constellation.",
    note: "An interactive particle network responding to your pointer.",
  },
] as const;

export function ExperimentPlayground() {
  const [category, setCategory] = useState(0);
  const [intensity, setIntensity] = useState(55);
  const [paused, setPaused] = useState(false);
  const [seed, setSeed] = useState(1);
  const canvas = useRef<HTMLCanvasElement>(null);
  const section = useRef<HTMLElement>(null);
  const controls = useRef({ category, intensity, paused, seed });
  controls.current = { category, intensity, paused, seed };
  const redraw = useRef<() => void>(() => {});

  useEffect(() => {
    const el = canvas.current;
    const root = section.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx || !root) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0.5, y: 0.5 };
    let visible = false,
      frame = 0,
      time = 0,
      previous = 0;
    let width = 1000,
      height = 580;

    function random(n: number) {
      const x = Math.sin(n * 127.1 + controls.current.seed * 311.7) * 43758.5453;
      return x - Math.floor(x);
    }

    function render(now: number) {
      frame = 0;
      const c = controls.current;
      const moving = visible && !c.paused && !motion.matches;
      if (moving) time += previous ? Math.min(now - previous, 40) * 0.0004 : 0.006;
      previous = moving ? now : 0;
      ctx!.clearRect(0, 0, width, height);
      const power = c.intensity / 100;
      const centerX = width * (0.5 + (pointer.x - 0.5) * 0.14);
      const centerY = height * (0.5 + (pointer.y - 0.5) * 0.15);
      const ambient = ctx!.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        width * 0.48,
      );
      ambient.addColorStop(0, "rgba(139,99,190,.13)");
      ambient.addColorStop(1, "rgba(8,11,25,0)");
      ctx!.fillStyle = ambient;
      ctx!.fillRect(0, 0, width, height);
      ctx!.lineWidth = 0.8;
      if (c.category === 0) {
        for (let row = 0; row < 44; row++) {
          ctx!.beginPath();
          ctx!.strokeStyle = `rgba(${185 + row},${145 + row},235,${0.15 + power * 0.42})`;
          for (let x = 0; x <= width; x += 7) {
            const norm = (x / width - 0.5) * 6;
            const hill =
              Math.exp(-norm * norm * 0.8) * Math.sin(row * 0.13 + time + c.seed) * height * 0.18;
            const ripple = Math.sin(norm * 3 + time * 2 + row * 0.12) * 13 * power;
            const cursorBend =
              Math.exp(-((x / width - pointer.x) ** 2) * 18) * (pointer.y - 0.5) * 110 * power;
            const y = height * 0.22 + row * height * 0.013 + hill + ripple + cursorBend;
            if (!x) ctx!.moveTo(x, y);
            else ctx!.lineTo(x, y);
          }
          ctx!.stroke();
        }
      } else if (c.category === 1) {
        const radius = Math.min(width, height) * 0.35;
        const rotateY = time * 0.5 + (pointer.x - 0.5) * 2.5 + c.seed * 0.5;
        const rotateX = (pointer.y - 0.5) * 1.6 + 0.2;
        function point(latitude: number, longitude: number) {
          const x = Math.cos(latitude) * Math.cos(longitude),
            y = Math.sin(latitude),
            z = Math.cos(latitude) * Math.sin(longitude);
          const rx = x * Math.cos(rotateY) + z * Math.sin(rotateY),
            rz = z * Math.cos(rotateY) - x * Math.sin(rotateY);
          const ry = y * Math.cos(rotateX) - rz * Math.sin(rotateX),
            depth = y * Math.sin(rotateX) + rz * Math.cos(rotateX);
          const perspective = 2.7 / (2.7 - depth * (0.3 + power * 0.7));
          return [centerX + rx * radius * perspective, centerY + ry * radius * perspective, depth];
        }
        for (let band = 0; band < 30; band++) {
          ctx!.beginPath();
          ctx!.strokeStyle = `rgba(204,172,244,${0.2 + power * 0.42})`;
          for (let n = 0; n <= 100; n++) {
            const latitude =
              band < 15 ? -Math.PI / 2 + (band / 14) * Math.PI : -Math.PI / 2 + (n / 100) * Math.PI;
            const longitude =
              band < 15 ? (n / 100) * Math.PI * 2 : ((band - 15) / 15) * Math.PI * 2;
            const [x, y] = point(latitude, longitude);
            if (!n) ctx!.moveTo(x!, y!);
            else ctx!.lineTo(x!, y!);
          }
          ctx!.stroke();
        }
      } else if (c.category === 2) {
        for (let orbit = 0; orbit < 8; orbit++) {
          const radius = 45 + orbit * Math.min(width, height) * 0.036;
          for (let trail = 0; trail < 70; trail++) {
            const angle = time * (1 + orbit * 0.13) - trail * 0.026 + orbit * 1.9 + c.seed;
            const x = centerX + Math.cos(angle) * radius * 1.65,
              y = centerY + Math.sin(angle) * radius * 0.65;
            ctx!.beginPath();
            ctx!.fillStyle = `rgba(215,${165 + orbit * 7},245,${(1 - trail / 70) * (0.35 + power * 0.6)})`;
            ctx!.arc(x, y, trail === 0 ? 2.8 : 1.2, 0, Math.PI * 2);
            ctx!.fill();
          }
        }
      } else {
        const nodes = Array.from({ length: 65 }, (_, i) => {
          const x = random(i + 1) * width,
            y = random(i + 90) * height;
          const distance = Math.hypot(x - pointer.x * width, y - pointer.y * height);
          const pull = Math.max(0, 1 - distance / (width * 0.35)) * power * 0.4;
          return {
            x: x + (pointer.x * width - x) * pull + Math.sin(time + i) * 7,
            y: y + (pointer.y * height - y) * pull + Math.cos(time + i) * 7,
          };
        });
        nodes.forEach((a, i) => {
          ctx!.beginPath();
          ctx!.fillStyle = "rgba(220,189,250,.9)";
          ctx!.arc(a.x, a.y, 1.6, 0, Math.PI * 2);
          ctx!.fill();
          nodes.slice(i + 1).forEach((b) => {
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 140 + power * 60) {
              ctx!.beginPath();
              ctx!.strokeStyle = `rgba(186,145,225,${(1 - d / (140 + power * 60)) * 0.5})`;
              ctx!.moveTo(a.x, a.y);
              ctx!.lineTo(b.x, b.y);
              ctx!.stroke();
            }
          });
        });
      }
      if (moving) frame = requestAnimationFrame(render);
    }

    function schedule() {
      if (!frame && visible) frame = requestAnimationFrame(render);
    }
    function resize() {
      const bounds = el!.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(devicePixelRatio, 1.5);
      el!.width = Math.round(width * dpr);
      el!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      schedule();
    }
    function move(event: PointerEvent) {
      const r = el!.getBoundingClientRect();
      pointer.x = Math.min(1, Math.max(0, (event.clientX - r.left) / r.width));
      pointer.y = Math.min(1, Math.max(0, (event.clientY - r.top) / r.height));
      schedule();
    }
    function reset() {
      pointer.x = pointer.y = 0.5;
      schedule();
    }
    function scroll() {
      if (visible && !motion.matches) {
        const r = root!.getBoundingClientRect();
        root!.style.setProperty(
          "--lab-parallax",
          `${Math.max(-35, Math.min(35, (innerHeight * 0.5 - r.top - r.height * 0.5) * 0.035))}px`,
        );
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible) {
          resize();
          schedule();
        } else {
          cancelAnimationFrame(frame);
          frame = 0;
          previous = 0;
        }
      },
      { threshold: 0.01 },
    );
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(root);
    resizeObserver.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", reset);
    window.addEventListener("scroll", scroll, { passive: true });
    motion.addEventListener("change", schedule);
    redraw.current = schedule;
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", reset);
      window.removeEventListener("scroll", scroll);
      motion.removeEventListener("change", schedule);
      redraw.current = () => {};
    };
  }, []);

  useEffect(() => {
    redraw.current();
  }, [category, intensity, paused, seed]);
  const study = studies[category]!;
  return (
    <section
      ref={section}
      id="experiments"
      className="experiments chapter-section"
      aria-labelledby="experiments-title"
      data-paused={paused}
    >
      <div className="chapter-wrap">
        <header className="chapter-heading" data-chapter-reveal>
          <div>
            <p className="chapter-kicker">04. EXPERIMENTS</p>
            <h2 id="experiments-title">
              AI / 3D /<br />
              <span>Motion / Web.</span>
            </h2>
          </div>
          <div className="chapter-aside">
            <p>
              No brief. No boundaries.
              <br />
              Just curiosity, made visible.
            </p>
            <span>AN OPEN-ENDED PLAYGROUND</span>
          </div>
        </header>
        <div className="lab-composition">
          <div className="lab-orbit" aria-hidden="true" />
          <div className="lab-floating lab-floating-one" aria-hidden="true">
            <img src="/images/works/othermatter.jpg" alt="" loading="lazy" />
            <span>FORM / 002</span>
          </div>
          <div className="lab-floating lab-floating-two" aria-hidden="true">
            <img src="/images/works/pulse.jpg" alt="" loading="lazy" />
            <span>FREQUENCY / 003</span>
          </div>
          <div className="lab-stage">
            <div className="lab-stage-header">
              <span>LIVE STUDY / 0{category + 1}</span>
              <span className="lab-live">
                <i /> {paused ? "PAUSED" : "INTERACTIVE"}
              </span>
            </div>
            <canvas
              ref={canvas}
              className="experiment-canvas"
              aria-label={`${study.title}: ${study.hint}`}
            />
            <span className="lab-coordinate" aria-hidden="true">
              X / Y / ∞
            </span>
            <div className="lab-stage-caption">
              <h3>{study.title}</h3>
              <p>{study.subtitle}</p>
            </div>
          </div>
        </div>
        <div className="lab-controls">
          <div className="lab-categories" role="tablist" aria-label="Experiment categories">
            {studies.map((s, i) => (
              <button
                key={s.name}
                role="tab"
                id={`lab-tab-${i}`}
                aria-selected={category === i}
                aria-controls="lab-description"
                tabIndex={category === i ? 0 : -1}
                onClick={() => setCategory(i)}
                onKeyDown={(e) => {
                  let next = i;
                  if (e.key === "ArrowRight") next = (i + 1) % 4;
                  else if (e.key === "ArrowLeft") next = (i + 3) % 4;
                  else if (e.key === "Home") next = 0;
                  else if (e.key === "End") next = 3;
                  else return;
                  e.preventDefault();
                  setCategory(next);
                  document.getElementById(`lab-tab-${next}`)?.focus();
                }}
              >
                {s.name}
                <ArrowUpRight size={13} />
              </button>
            ))}
          </div>
          <div className="lab-tuning">
            <label htmlFor="lab-intensity">
              Intensity <span>{intensity}%</span>
            </label>
            <input
              id="lab-intensity"
                aria-label="Experiment intensity"
              type="range"
              min="10"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
            />
            <button onClick={() => setSeed(seed + 1)} aria-label="Shuffle experiment">
              <Shuffle size={16} />
            </button>
            <button
              onClick={() => setPaused(!paused)}
              aria-pressed={paused}
              aria-label={paused ? "Play experiment" : "Pause experiment"}
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          </div>
        </div>
        <div
          id="lab-description"
          role="tabpanel"
          aria-labelledby={`lab-tab-${category}`}
          className="lab-description"
        >
          <p>{study.hint}</p>
          <span>{study.note}</span>
        </div>
      </div>
    </section>
  );
}
