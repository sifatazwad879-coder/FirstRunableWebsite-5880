import { useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { CursorReveal } from "../components/cursor-reveal";
import { CreativeProcess } from "../components/creative-process";
import { PortfolioChapters } from "../components/portfolio-chapters";

type Panel = "Work" | "About" | "Contact";

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  function openPanel(next: Panel) {
    setMenuOpen(false);
    setPanel(next);
    dialog.current?.showModal();
  }

  function closePanel() {
    dialog.current?.close();
    setPanel(null);
  }

  return (
    <main>
    <section className="hero" id="portfolio-hero" aria-label="Introduction">
      <img className="hero-image" src="/images/hero-original.png" alt="Neon digital figure with a glowing ring-shaped head beside a laptop in a purple cinematic landscape" fetchPriority="high" />
      <div className="atmosphere" aria-hidden="true" />
      <CursorReveal />

      <header className="header">
        <button className="logo" aria-label="MILADICODE home" onClick={() => { closePanel(); setMenuOpen(false); }}>MILADI<span>CODE</span></button>
        <button className="menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        <nav id="main-navigation" className={`nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
          <button className={panel === null ? "active" : ""} aria-current={panel === null ? "page" : undefined} onClick={() => { closePanel(); setMenuOpen(false); }}>Home</button>
          {(["Work", "About", "Contact"] as const).map((item) => <button key={item} className={panel === item ? "active" : ""} onClick={() => openPanel(item)}>{item}</button>)}
        </nav>
      </header>

      <section className="hero-content" aria-labelledby="hero-title">
        <p className="eyebrow">DIGITAL ARTIST / CREATIVE TECHNOLOGIST</p>
        <h1 id="hero-title"><span>Where Creativity</span><span>Meets</span><span className="accent">Technology</span></h1>
        <p className="supporting">Exploring the intersection of art and innovation.<br className="hidden sm:block" /> Crafting immersive digital experiences that<br className="hidden sm:block" /> push the boundaries of imagination.</p>
        <button className="work-cta" onClick={() => openPanel("Work")}><span className="arrow-circle"><ArrowUpRight size={20} strokeWidth={1.3} /></span><span>View My Work</span></button>
      </section>

      <aside className="disciplines" aria-label="Creative disciplines"><span className="rail-line" aria-hidden="true" /><div className="discipline-labels"><span>AI</span><span>3D</span><span>MOTION</span><span>WEB</span></div></aside>
      <button className="scroll-cue" onClick={() => document.getElementById("creative-process")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}><ArrowDown size={15} strokeWidth={1} /><span>SCROLL TO EXPLORE</span></button>

      <dialog ref={dialog} className="portfolio-dialog" aria-labelledby="panel-title" onClose={() => setPanel(null)}>
        <button className="dialog-close" aria-label="Close panel" onClick={closePanel}><X size={20} strokeWidth={1.5} /></button>
        <p className="dialog-label">MILADICODE / {panel?.toUpperCase()}</p>
        <h2 id="panel-title">{panel === "Work" ? "A glimpse into the digital." : panel === "About" ? "Art, with a different dimension." : "Let’s create something unexpected."}</h2>
        {panel === "Work" && <><img className="work-preview" src="/images/hero-original.png" alt="Original neon digital artwork featured in this portfolio hero" /><div className="work-caption"><span>FEATURED HERO ARTWORK</span><span>AI / 3D / MOTION / WEB</span></div><p>Selected projects will appear here as the portfolio grows.</p></>}
        {panel === "About" && <p>A digital artist and creative technologist exploring the space where imagination meets innovation. Working across AI, 3D, motion, and the web to turn ideas into immersive digital experiences.</p>}
        {panel === "Contact" && <><p>For creative collaborations, digital experiences, and ideas that go beyond the expected.</p><p>Contact details haven’t been added to this portfolio yet.</p></>}
      </dialog>
    </section>
    <CreativeProcess onViewWork={() => openPanel("Work")} />
    <PortfolioChapters />
    </main>
  );
}