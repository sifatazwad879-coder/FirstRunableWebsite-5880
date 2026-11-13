import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowUpRight,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  X,
  Check,
  Copy,
  Youtube,
} from "lucide-react";
import { ExperimentPlayground } from "./experiment-playground";
import "./portfolio-chapters.css";

const projects = [
  {
    title: "Nocturne",
    subtitle: "A world between waking & dreaming",
    category: "AI / ENVIRONMENT CONCEPT",
    image: "/images/works/nocturne.jpg",
    alt: "Purple Milky Way and a shooting star above silhouetted mountains",
    text: "An imagined digital landscape where silence becomes the interface. This concept explores slow transitions, celestial light, and the feeling of moving through an unfamiliar world.",
    approach: "Atmospheric storytelling · Environmental direction · Slow interaction",
    source:
      "https://unsplash.com/photos/silhouette-photo-of-mountain-during-night-time-ln5drpv_ImI",
  },
  {
    title: "Other Matter",
    subtitle: "Objects that refuse to sit still",
    category: "3D / MATERIAL STUDY",
    image: "/images/works/othermatter.jpg",
    alt: "Glossy purple sculptural forms and floating spheres against black",
    text: "A speculative material study built around impossible objects. The direction pairs sculptural tension with reflective surfaces, inviting the viewer to question weight, form, and gravity.",
    approach: "Sculptural direction · Material exploration · Spatial composition",
    source:
      "https://unsplash.com/photos/purple-liquid-swirling-inside-a-glass-container-with-bubbles-GNMd5gkTOVY",
  },
  {
    title: "Pulse / 001",
    subtitle: "Light, translated into rhythm",
    category: "MOTION / GENERATIVE CONCEPT",
    image: "/images/works/pulse.jpg",
    alt: "Pink and purple light lines forming an abstract tunnel",
    text: "A motion concept for an audiovisual light field. Repetition and interruption become a visual score, turning a simple pulse into an immersive spatial rhythm.",
    approach: "Rhythm studies · Light choreography · Generative systems",
    source: "https://unsplash.com/photos/abstract-tunnel-of-purple-and-pink-light-p-tsgC5Ur3s",
  },
  {
    title: "Refract",
    subtitle: "A different way of seeing the web",
    category: "WEB / INTERACTIVE CONCEPT",
    image: "/images/works/refract.jpg",
    alt: "Transparent curved glass surfaces with lavender and purple reflections",
    text: "An interface concept that treats a browser as a lens rather than a page. Layered reflections, restrained typography, and responsive depth suggest a more tactile digital space.",
    approach: "Interaction design · Optical depth · Creative development",
    source: "https://unsplash.com/s/photos/3d-render-glass",
  },
] as const;

export function chapterTilt(event: PointerEvent<HTMLElement>) {
  if (
    event.pointerType !== "mouse" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  const e = event.currentTarget;
  const r = e.getBoundingClientRect();
  const x = (event.clientX - r.left) / r.width - 0.5;
  const y = (event.clientY - r.top) / r.height - 0.5;
  e.style.setProperty("--depth-x", `${-y * 3}deg`);
  e.style.setProperty("--depth-y", `${x * 4}deg`);
  e.style.setProperty("--image-x", `${x * 10}px`);
  e.style.setProperty("--image-y", `${y * 10}px`);
}

export function clearChapterTilt(event: PointerEvent<HTMLElement>) {
  ["--depth-x", "--depth-y", "--image-x", "--image-y"].forEach((p) =>
    event.currentTarget.style.removeProperty(p),
  );
}

function jumpTo(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
}

export function PortfolioChapters() {
  const root = useRef<HTMLDivElement>(null);
  const projectDialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [ambientPaused, setAmbientPaused] = useState(false);
  const project = projects[selected]!;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "true";
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    el.querySelectorAll("[data-chapter-reveal]").forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, []);

  function openProject(index: number) {
    setSelected(index);
    projectDialog.current?.showModal();
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("sifatazwad879@gmail.com");
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div ref={root} className="portfolio-chapters" data-ambient-paused={ambientPaused}>
      <section
        id="selected-works"
        className="selected-works chapter-section"
        aria-labelledby="works-title"
      >
        <div className="chapter-wrap">
          <header className="chapter-heading" data-chapter-reveal>
            <div>
              <p className="chapter-kicker">03. SELECTED WORKS</p>
              <h2 id="works-title">
                Things I’ve
                <br />
                <span>Brought to Life.</span>
              </h2>
            </div>
            <div className="chapter-aside">
              <p>
                Imagined worlds. Unexpected forms.
                <br />
                Experiences beyond the ordinary.
              </p>
              <span>FOUR CONCEPT STUDIES / 2026</span>
            </div>
          </header>
          <p className="concept-disclaimer">
            Concept / demo portfolio — sourced visual references, not commissioned or completed
            client work.
          </p>
          <div className="works-composition">
            {projects.map((p, i) => (
              <article key={p.title} className={`work-piece work-piece-${i}`} data-chapter-reveal>
                <button
                  className="work-visual"
                  onClick={() => openProject(i)}
                  onPointerMove={chapterTilt}
                  onPointerLeave={clearChapterTilt}
                  aria-label={`View Project: ${p.title}`}
                >
                  <img src={p.image} alt={p.alt} loading="lazy" width="1600" height="1000" />
                  <span className="visual-vignette" aria-hidden="true" />
                  <span className="work-badge">CONCEPT STUDY / 0{i + 1}</span>
                  <span className="work-visual-caption">
                    <span>{p.subtitle}</span>
                    <span className="work-open">
                      View Project <ArrowUpRight size={18} strokeWidth={1.2} />
                    </span>
                  </span>
                </button>
                <div className="work-meta">
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.category}</p>
                  </div>
                  <span>
                    2026 <span>↗</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="works-endnote">
            <span>BETWEEN ART, CODE & THE UNEXPECTED</span>
            <button onClick={() => jumpTo("experiments")}>
              Step inside the lab <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <ExperimentPlayground />

      <footer
        id="contact"
        className="cinematic-footer chapter-section"
        aria-labelledby="contact-title"
      >
        <div className="footer-halo" aria-hidden="true" />
        <div className="footer-particles" aria-hidden="true">
          {Array.from({ length: 17 }, (_, i) => (
            <i
              key={i}
              style={{
                left: `${(i * 37 + 7) % 100}%`,
                top: `${(i * 23 + 9) % 100}%`,
                animationDelay: `${-i * 1.7}s`,
              }}
            />
          ))}
        </div>
        <div className="chapter-wrap">
          <div className="footer-scene" data-chapter-reveal>
            <p className="chapter-kicker">05. THE NEXT CHAPTER</p>
            <h2 id="contact-title">
              Have an idea
              <br />
              worth bringing
              <br />
              <span>to life?</span>
            </h2>
            <div className="footer-invitation">
              <p>
                Let’s turn the unexpected
                <br />
                into something unforgettable.
              </p>
              <a
                className="create-cta"
                href="mailto:sifatazwad879@gmail.com?subject=Let%E2%80%99s%20create%20something&body=Hi%2C%0A%0AI%20have%20an%20idea%20I%E2%80%99d%20love%20to%20bring%20to%20life%3A%0A%0A"
                onPointerMove={chapterTilt}
                onPointerLeave={clearChapterTilt}
              >
                Let’s Create{" "}
                <span>
                  <ArrowUpRight size={32} strokeWidth={1} />
                </span>
              </a>
            </div>
          </div>
          <div className="footer-contact-line">
            <a href="mailto:sifatazwad879@gmail.com">sifatazwad879@gmail.com</a>
            <button onClick={copyEmail} aria-label={copied ? "Email copied" : "Copy email address"}>
              {copied ? <Check size={15} /> : <Copy size={14} />}
            </button>
            <output>
              {copyError
                ? "Copy unavailable — select the email address."
                : copied
                  ? "Copied to clipboard"
                  : ""}
            </output>
          </div>
          <div className="footer-links">
            <a
              className="footer-wordmark"
              href="#portfolio-hero"
              onClick={(e) => {
                e.preventDefault();
                jumpTo("portfolio-hero");
              }}
            >
              MILADI<span>CODE</span>
            </a>
            <nav aria-label="Footer navigation">
              <a
                href="#portfolio-hero"
                onClick={(e) => {
                  e.preventDefault();
                  jumpTo("portfolio-hero");
                }}
              >
                Home
              </a>
              <a
                href="#creative-process"
                onClick={(e) => {
                  e.preventDefault();
                  jumpTo("creative-process");
                }}
              >
                Process
              </a>
              <a
                href="#selected-works"
                onClick={(e) => {
                  e.preventDefault();
                  jumpTo("selected-works");
                }}
              >
                Work
              </a>
              <a
                href="#experiments"
                onClick={(e) => {
                  e.preventDefault();
                  jumpTo("experiments");
                }}
              >
                Experiments
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  jumpTo("contact");
                }}
              >
                Contact
              </a>
            </nav>
            <a
              className="footer-social"
              href="https://www.youtube.com/channel/UC6uKLEvYo63dIQJ3lAiVJ9w"
              target="_blank"
              rel="noreferrer"
            >
              <Youtube size={16} /> YouTube <ArrowUpRight size={13} />
            </a>
          </div>
          <div className="footer-bottom">
            <span>© 2026 MILADICODE</span>
            <span>IMAGINATION, MADE INTERACTIVE.</span>
            <div>
              <button onClick={() => setAmbientPaused(!ambientPaused)} aria-pressed={ambientPaused}>
                {ambientPaused ? "Resume ambient motion" : "Pause ambient motion"}
              </button>
              <button onClick={() => jumpTo("portfolio-hero")} aria-label="Back to top">
                <ArrowUp size={15} />
              </button>
            </div>
          </div>
        </div>
      </footer>

      <dialog ref={projectDialog} className="project-dialog" aria-labelledby="project-dialog-title">
        <button
          className="project-close"
          aria-label="Close project"
          onClick={() => projectDialog.current?.close()}
        >
          <X size={22} />
        </button>
        <img className="project-dialog-image" src={project.image} alt={project.alt} />
        <div className="project-dialog-content">
          <p className="chapter-kicker">CONCEPT STUDY / 0{selected + 1} / 2026</p>
          <h2 id="project-dialog-title">{project.title}</h2>
          <p className="project-category">{project.category}</p>
          <p>{project.text}</p>
          <p className="project-approach">{project.approach}</p>
          <p className="project-source">
            Demo concept; the image is a sourced visual reference, not original client work.{" "}
            <a href={project.source} target="_blank" rel="noreferrer">
              {selected === 3 ? "Browse visual reference library" : "View original image source"}{" "}
              <ArrowUpRight size={12} />
            </a>
          </p>
          <div className="project-dialog-nav">
            <button onClick={() => setSelected((selected + 3) % 4)} aria-label="Previous concept">
              <ArrowLeft size={16} /> Previous
            </button>
            <span>0{selected + 1} / 04</span>
            <button onClick={() => setSelected((selected + 1) % 4)} aria-label="Next concept">
              Next <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
