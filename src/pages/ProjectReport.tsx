import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PowerBIReport } from "../components/PowerBIReport";
import { ProjectCard } from "../components/ProjectCard";
import { projectBySlug, projects } from "../data/projects";

export function ProjectReport() {
  const { slug = "" } = useParams();
  const project = projectBySlug(slug);
  useEffect(() => {
    document.title = project
      ? `${project.title} — Earth / Action`
      : "Project not found — Earth / Action";
  }, [project]);
  if (!project)
    return (
      <div className="not-found page-width">
        <p className="eyebrow">Project not found</p>
        <h1>Let’s find another place to start.</h1>
        <Link className="button" to="/#notable">
          Explore projects ↗
        </Link>
      </div>
    );
  return (
    <article className="project-report">
      <header className="report-header page-width">
        <Link className="text-link back-link" to="/#notable">
          ← Back to projects
        </Link>
        <div className="report-meta">
          <span className="eyebrow">
            {project.category} / {project.location}
          </span>
          <span className={`status-pill ${project.status}`}>
            {project.sample
              ? "Sample proposal"
              : "Documented external initiative"}
          </span>
        </div>
        <h1>{project.title}</h1>
        <p className="report-lead">{project.summary}</p>
        <div className="report-byline">
          <span>{project.organisation}</span>
          <a href="#dashboard" className="text-link">
            Explore the dashboard ↓
          </a>
        </div>
      </header>
      <figure className="report-cover page-width">
        <img src={project.image} alt={project.imageAlt} />
        <figcaption>{project.imageCaption}</figcaption>
      </figure>
      <div className="report-layout page-width">
        <aside className="report-toc" aria-label="Report contents">
          <p className="eyebrow">In this report</p>
          <a href="#overview">Overview</a>
          {project.sections.map((section, index) => (
            <a key={section.title} href={`#story-${index}`}>
              {section.title}
            </a>
          ))}
          <a href="#gallery">Images from the project</a>
          <a href="#dashboard">Power BI dashboard</a>
          <a href="#sources">Sources & context</a>
          <Link to="/#donate" className="button button-outline">
            Support a project ↗
          </Link>
        </aside>
        <div className="report-story">
          <section id="overview">
            <p className="eyebrow">The challenge / the response</p>
            <h2>From need to action.</h2>
            <div className="challenge-response">
              <div>
                <span className="eyebrow">The challenge</span>
                <p>{project.challenge}</p>
              </div>
              <div>
                <span className="eyebrow">The response</span>
                <p>{project.response}</p>
              </div>
            </div>
          </section>
          {project.sections.map((section, index) => (
            <section
              id={`story-${index}`}
              key={section.title}
              className="story-section"
            >
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </section>
          ))}
          <section id="gallery" className="story-section">
            <p className="eyebrow">In pictures</p>
            <h2>The places behind the story.</h2>
            <div className="report-gallery">
              {project.gallery.map((image) => (
                <figure key={image.src}>
                  <img src={image.src} alt={image.alt} loading="lazy" />
                  <figcaption>{image.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
          <PowerBIReport key={project.slug} project={project} />
          <section id="sources" className="story-section report-sources">
            <p className="eyebrow">Sources / context</p>
            <h2>Keep the evidence connected.</h2>
            {project.sources.length ? (
              <ul>
                {project.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                This is an illustrative proposal. No partner, delivery date or
                measured outcome has been confirmed.
              </p>
            )}
            <p className="report-note">
              {project.sample
                ? "Sample content for the report template."
                : "This is an independent source-based example, not a claim of affiliation, project delivery or donation eligibility."}{" "}
              Coordinates are approximate. Images are original illustrations.
            </p>
          </section>
        </div>
      </div>
      <section className="content-section related-projects page-width">
        <div className="section-heading">
          <p className="eyebrow">Keep exploring</p>
          <h2>Another place. Another possibility.</h2>
        </div>
        <div className="project-grid">
          {projects
            .filter(
              (item) => item.slug !== project.slug && item.status === "notable",
            )
            .slice(0, 3)
            .map((item) => (
              <ProjectCard key={item.slug} project={item} />
            ))}
        </div>
      </section>
    </article>
  );
}
