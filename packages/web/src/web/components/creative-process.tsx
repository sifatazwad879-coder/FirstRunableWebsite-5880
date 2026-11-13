import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, Box, Compass, Orbit, Sparkles, WandSparkles, Plus, Minus } from "lucide-react";

const steps = [
  { name: "Discover", subtitle: "Ideas & Inspiration", icon: Compass, intro: "Every experience begins with a spark.", detail: "Collect references, question assumptions, and uncover the feeling behind the idea. Define a creative direction before choosing the tools.", output: "A clear creative direction", tags: ["Research", "Moodboards", "Intent"] },
  { name: "Explore", subtitle: "AI & Concepts", icon: Sparkles, intro: "Give the unexpected room to emerge.", detail: "Explore possibilities with AI, sketch visual worlds, and test different narratives. Refine the strongest concepts into a language of their own.", output: "A visual concept worth pursuing", tags: ["AI exploration", "Concepts", "Iteration"] },
  { name: "Build", subtitle: "3D & Creative Code", icon: Box, intro: "Turn imagination into something tangible.", detail: "Shape geometry, materials, and light. Combine 3D with creative code to build a system that feels as considered as the original idea.", output: "A crafted digital foundation", tags: ["3D form", "Materials", "Creative code"] },
  { name: "Animate", subtitle: "Motion & Interaction", icon: Orbit, intro: "Make the experience feel alive.", detail: "Choreograph movement, tune timing, and design how an experience responds. Small interactions create depth without distracting from the story.", output: "An expressive, responsive experience", tags: ["Motion", "Timing", "Interaction"] },
  { name: "Create", subtitle: "Final Experience", icon: WandSparkles, intro: "Bring every detail into harmony.", detail: "Polish the light, rhythm, and performance. Test across screens and inputs, then bring the finished experience into the world.", output: "An experience ready to be explored", tags: ["Refinement", "Accessibility", "Delivery"] },
] as const;

const trail = "M 500 160 C 690 245 310 395 500 480 C 690 565 310 715 500 800 C 690 885 310 1035 500 1120 C 690 1205 310 1355 500 1440";

function scrollToElement(element: HTMLElement | null) {
  element?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "center" });
}

export function CreativeProcess({ onViewWork }: { onViewWork: () => void }) {
  const section = useRef<HTMLElement>(null);
  const journey = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const root = section.current;
    const track = journey.current;
    if (!root || !track) return;
    let frame = 0;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    function update() {
      frame = 0;
      const bounds = track!.getBoundingClientRect();
      const rowHeight = track!.firstElementChild?.getBoundingClientRect().height ?? 320;
      const progress = Math.min(1, Math.max(0, (window.innerHeight * .5 - bounds.top - rowHeight / 2) / (bounds.height - rowHeight)));
      root!.style.setProperty("--journey-progress", String(progress));
      root!.style.setProperty("--ambient-shift", motion.matches ? "0px" : `${(progress - .5) * 80}px`);
      setActive(Math.round(progress * 4));
    }
    function requestUpdate() { if (!frame) frame = requestAnimationFrame(update); }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { (entry.target as HTMLElement).dataset.visible = String(entry.isIntersecting); });
    }, { threshold: .15 });
    track.querySelectorAll(".process-step").forEach((row) => observer.observe(row));
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", requestUpdate); window.removeEventListener("resize", requestUpdate); };
  }, []);

  function jump(index: number) {
    scrollToElement(document.getElementById(`process-step-${index}`));
  }

  function tilt(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = event.currentTarget.closest<HTMLElement>(".process-card");
    if (!card) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    card.style.setProperty("--tilt-x", `${-y * 5}deg`);
    card.style.setProperty("--tilt-y", `${x * 7}deg`);
    card.style.setProperty("--parallax-x", `${x * 6}px`);
    card.style.setProperty("--parallax-y", `${y * 6}px`);
    card.style.setProperty("--light-x", `${(x + .5) * 100}%`);
    card.style.setProperty("--light-y", `${(y + .5) * 100}%`);
  }

  function resetTilt(event: PointerEvent<HTMLButtonElement>) {
    const card = event.currentTarget.closest<HTMLElement>(".process-card");
    ["--tilt-x", "--tilt-y", "--parallax-x", "--parallax-y"].forEach((property) => card?.style.removeProperty(property));
  }

  return (
    <section ref={section} id="creative-process" className="creative-process" aria-labelledby="process-heading">
      <div className="process-atmosphere" aria-hidden="true" />
      <div className="process-wrap">
        <header className="process-heading">
          <div><p className="process-kicker"><span /> THE ART OF MAKING</p><h2 id="process-heading">Creative<br /><span>Process.</span></h2></div>
          <div className="process-introduction"><p>From a fleeting idea to a world you can feel.<br />Five stages. One continuous exploration.</p><button onClick={() => jump(0)} className="process-begin">Follow the journey <ArrowDown size={16} strokeWidth={1.3} /></button></div>
        </header>

        <nav className="process-stage-nav" aria-label="Jump to a process stage">
          <span className="stage-nav-label">THE JOURNEY</span>
          {steps.map((step, i) => <button key={step.name} aria-label={`Go to step ${i + 1}: ${step.name}`} aria-current={active === i ? "step" : undefined} onClick={() => jump(i)}><span>0{i + 1}</span><span className="stage-name">{step.name}</span></button>)}
          <span className="stage-count">0{active + 1} <span>/ 05</span></span>
        </nav>

        <div className="journey-space">
          <svg className="journey-trail journey-trail-desktop" viewBox="0 0 1000 1600" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="process-light" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d4b5ff" /><stop offset="55%" stopColor="#e8bad7" /><stop offset="100%" stopColor="#b2a6ec" /></linearGradient><filter id="process-soft-glow" x="-100%" y="-20%" width="300%" height="140%"><feGaussianBlur stdDeviation="6" /></filter></defs>
            <path className="trail-base" d={trail} />
            <path className="trail-glow" d={trail} pathLength="1" filter="url(#process-soft-glow)" />
            <path className="trail-fill" d={trail} pathLength="1" />
          </svg>
          <div className="journey-mobile-rail" aria-hidden="true"><span /></div>
          <ol ref={journey} className="process-journey">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const open = expanded === i;
              return <li id={`process-step-${i}`} key={step.name} className={`process-step ${active === i ? "is-active" : ""}`}>
                <button className={`journey-node ${active >= i ? "is-lit" : ""}`} aria-label={`Explore ${step.name}, step ${i + 1}`} onClick={() => { jump(i); setExpanded(i); }}><span>0{i + 1}</span></button>
                <div className={`process-card ${open ? "is-expanded" : ""}`}>
                  <span className="card-corner" aria-hidden="true" />
                  <button className="process-card-trigger" aria-expanded={open} aria-controls={`process-detail-${i}`} onClick={() => setExpanded(open ? null : i)} onPointerMove={tilt} onPointerLeave={resetTilt}>
                    <span className="process-card-top"><span className="process-step-label">STAGE 0{i + 1}</span><span className="process-symbol" aria-hidden="true"><Icon size={22} strokeWidth={1} /></span></span>
                    <span className="process-card-title">{step.name}<span className="disclosure-icon">{open ? <Minus size={17} strokeWidth={1} /> : <Plus size={17} strokeWidth={1} />}</span></span>
                    <span className="process-subtitle">{step.subtitle}</span>
                    <span className="process-intro">{step.intro}</span>
                  </button>
                  <section id={`process-detail-${i}`} className="process-detail" aria-label={`${step.name} process details`} hidden={!open}>
                    <p>{step.detail}</p><div className="process-tags">{step.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <p className="process-output"><span>OUTCOME</span> {step.output}</p>
                  </section>
                </div>
                <div className="stage-echo" aria-hidden="true"><span>0{i + 1}</span><small>{i === 4 ? "THE IDEA, REALIZED" : "IMAGINATION IN PROGRESS"}</small></div>
              </li>;
            })}
          </ol>
        </div>
        <footer className="process-footer"><div><p className="process-kicker">ENDLESS POSSIBILITIES</p><h3>The process ends.<br /><span>The experience begins.</span></h3></div><div className="process-footer-actions"><button className="work-cta" onClick={onViewWork}><span className="arrow-circle"><ArrowUpRight size={20} strokeWidth={1.3} /></span>Explore the artwork</button><button className="process-back" onClick={() => scrollToElement(document.getElementById("portfolio-hero"))}>Back to the beginning <ArrowUp size={14} /></button></div></footer>
      </div>
    </section>
  );
}