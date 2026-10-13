import { useEffect, useRef, useState } from "react";
import { Globe, type AtlasMode } from "./Globe";
import type { ProjectStatus } from "../data/projects";
import { rotationFromProgress, scrollProgress } from "../lib/atlas";

export function EarthSection() {
  const section = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<AtlasMode>("solutions");
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [layers, setLayers] = useState({ climate: true, conflict: true });
  const [statuses, setStatuses] = useState<Record<ProjectStatus, boolean>>({
    notable: true,
    upcoming: true,
    potential: true,
  });
  const rotation = rotationFromProgress(progress);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(media.matches);
    change();
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const node = section.current;
      if (!node || reducedMotion) {
        setProgress(0);
        return;
      }
      const bounds = node.getBoundingClientRect();
      const header =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-height",
          ),
        ) || 80;
      setProgress(
        scrollProgress(
          bounds.top - header,
          bounds.height,
          window.innerHeight - header,
        ),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  function changeMode(next: AtlasMode) {
    setMode(next);
  }
  return (
    <section
      ref={section}
      className={`earth-scroll ${reducedMotion ? "reduced-motion" : ""}`}
      aria-labelledby="earth-title"
    >
      <div className="earth-sticky">
        <div className="earth-layout page-width">
          <div className="hero-copy">
            <p className="eyebrow">One planet. Many possibilities.</p>
            <h1 id="earth-title">
              {mode === "solutions" ? (
                <>
                  A world worth
                  <br />
                  <em>acting for.</em>
                </>
              ) : (
                <>
                  See what
                  <br />
                  <em>needs to change.</em>
                </>
              )}
            </h1>
            <p className="hero-description">
              {mode === "solutions"
                ? "Explore the projects restoring places, supporting communities and making change possible."
                : "Understand the pressures shaping our world — and the projects that could respond."}
            </p>
            <div
              className="atlas-selector"
              role="group"
              aria-label="Choose atlas mode"
            >
              <button
                type="button"
                aria-pressed={mode === "solutions"}
                onClick={() => changeMode("solutions")}
              >
                Solutions
              </button>
              <button
                type="button"
                aria-pressed={mode === "problems"}
                onClick={() => changeMode("problems")}
              >
                Problems
              </button>
            </div>
            <p className="atlas-caption">
              {mode === "solutions"
                ? "Real initiatives + sample proposals · approximate locations"
                : "Illustrative layers · not current risk measurements"}
            </p>
          </div>
          <div className="atlas-visual">
            <Globe
              rotation={rotation}
              mode={mode}
              layers={layers}
              statuses={statuses}
            />
            <fieldset className="atlas-filters">
              <legend className="sr-only">
                {mode === "solutions"
                  ? "Project status filters"
                  : "Problem layer filters"}
              </legend>
              {mode === "solutions"
                ? (["notable", "upcoming", "potential"] as const).map(
                    (status) => (
                      <label key={status} className={`filter ${status}`}>
                        <input
                          type="checkbox"
                          checked={statuses[status]}
                          onChange={(event) =>
                            setStatuses((value) => ({
                              ...value,
                              [status]: event.target.checked,
                            }))
                          }
                        />
                        {status === "notable"
                          ? "Notable"
                          : status === "upcoming"
                            ? "Upcoming"
                            : "Potential"}
                      </label>
                    ),
                  )
                : (["climate", "conflict"] as const).map((layer) => (
                    <label key={layer} className={`filter ${layer}`}>
                      <input
                        type="checkbox"
                        checked={layers[layer]}
                        onChange={(event) =>
                          setLayers((value) => ({
                            ...value,
                            [layer]: event.target.checked,
                          }))
                        }
                      />
                      {layer === "climate"
                        ? "Climate variations"
                        : "Conflict zones"}
                    </label>
                  ))}
            </fieldset>
          </div>
        </div>
        <div className="earth-bottom page-width">
          <span className="eyebrow muted">
            {reducedMotion
              ? "Explore projects below"
              : "Scroll to explore the planet ↓"}
          </span>
          <div
            className="rotation-progress"
            aria-label={`Globe rotation: ${Math.round(rotation)} of 360 degrees`}
          >
            <span>{Math.round(rotation)}°</span>
            <span className="progress-track">
              <span style={{ width: `${progress * 100}%` }} />
            </span>
            <span>360°</span>
          </div>
          <a href="#notable" className="text-link">
            Skip to projects ↘
          </a>
        </div>
      </div>
    </section>
  );
}
