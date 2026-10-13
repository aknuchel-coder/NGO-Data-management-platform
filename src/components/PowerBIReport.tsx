import { useState } from "react";
import type { Project } from "../data/projects";
import { powerBiEmbedUrl } from "../lib/atlas";

export function PowerBIReport({ project }: { project: Project }) {
  const [loaded, setLoaded] = useState(false);
  const configured = project.powerBi.embedUrl.trim();
  const url = powerBiEmbedUrl(configured);
  return (
    <section
      id="dashboard"
      className="report-dashboard"
      aria-labelledby="dashboard-title"
    >
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Evidence / interactive reporting</p>
          <h2 id="dashboard-title">Explore the data.</h2>
        </div>
        <span className="dashboard-badge">Power BI</span>
      </div>
      <p>{project.powerBi.description}</p>
      {url ? (
        <>
          <div className="powerbi-frame">
            {!loaded && (
              <div className="embed-loading" role="status">
                Loading the project dashboard…
              </div>
            )}
            <iframe
              key={url}
              title={`${project.title} — Power BI report`}
              src={url}
              loading="lazy"
              allowFullScreen
              onLoad={() => setLoaded(true)}
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <div className="embed-footer">
            <span>
              {project.powerBi.kind === "secure"
                ? "Microsoft sign-in and report access may be required."
                : "Publicly published report."}
            </span>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Open report in a new tab ↗
            </a>
          </div>
        </>
      ) : (
        <div className="dashboard-empty">
          <div className="dashboard-illustration" aria-hidden="true">
            <div className="demo-bars">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="demo-ring" />
          </div>
          <h3>
            {configured
              ? "Dashboard configuration needs attention."
              : "The project dashboard is coming next."}
          </h3>
          <p>
            {configured
              ? "This report has no valid Power BI embed URL. The project narrative and sources remain available."
              : "No Power BI report has been connected to this example. Once a report is supplied, its interactive visuals appear here."}
          </p>
          <span className="eyebrow muted">
            Illustrative preview · no measured results
          </span>
        </div>
      )}
    </section>
  );
}
