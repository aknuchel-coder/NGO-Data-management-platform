import { Link } from "react-router-dom";
import type { Project } from "../data/projects";

export function ProjectCard({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  return (
    <Link
      className={`project-card ${compact ? "compact" : ""}`}
      to={`/projects/${project.slug}`}
    >
      {!compact && (
        <div className="card-image">
          <img src={project.image} alt={project.imageAlt} loading="lazy" />
          <span className="image-tag">
            {project.sample ? "Sample proposal" : "External initiative"}
          </span>
        </div>
      )}
      <div className="card-body">
        <p className="eyebrow">
          {project.category} ·{" "}
          {project.sample ? "Sample concept" : project.location}
        </p>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <span className="text-link">
          Read the full report <span>↗</span>
        </span>
      </div>
    </Link>
  );
}
