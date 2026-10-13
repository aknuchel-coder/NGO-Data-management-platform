import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  geoCircle,
  geoContains,
  geoGraticule10,
  geoOrthographic,
  geoPath,
} from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import { projects, type ProjectStatus } from "../data/projects";
import { riskZones } from "../data/risks";
import { visibleOnGlobe } from "../lib/atlas";

export type AtlasMode = "solutions" | "problems";
interface Props {
  rotation: number;
  mode: AtlasMode;
  layers: { climate: boolean; conflict: boolean };
  statuses: Record<ProjectStatus, boolean>;
}

export function Globe({ rotation, mode, layers, statuses }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [land, setLand] = useState<FeatureCollection<Geometry> | null>(null);
  const [mapError, setMapError] = useState(false);
  const [hovered, setHovered] = useState("mosul");
  const [risk, setRisk] = useState(riskZones[0].id);
  const center = 20 + rotation;
  const projection = useMemo(
    () =>
      geoOrthographic()
        .scale(455)
        .translate([500, 500])
        .rotate([-center, -12])
        .clipAngle(90),
    [center],
  );
  const dots = useMemo(() => {
    if (!land) return [];
    const points: [number, number][] = [];
    for (let lat = -57; lat < 83; lat += 2) {
      for (let lon = -180; lon < 180; lon += 2) {
        if (geoContains(land, [lon, lat])) points.push([lon, lat]);
      }
    }
    return points;
  }, [land]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/land-110m.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Map unavailable");
        return response.json();
      })
      .then((topology: Topology<{ land: GeometryCollection }>) =>
        setLand(feature(topology, topology.objects.land)),
      )
      .catch((error) => {
        if (error.name !== "AbortError") setMapError(true);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const ctx = element.getContext("2d");
    if (!ctx) {
      setMapError(true);
      return;
    }
    const draw = () => {
      const size = element.getBoundingClientRect().width;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(size * ratio);
      element.height = Math.round(size * ratio);
      ctx.setTransform(element.width / 1000, 0, 0, element.height / 1000, 0, 0);
      ctx.clearRect(0, 0, 1000, 1000);
      const path = geoPath(projection, ctx);
      const ocean = ctx.createRadialGradient(350, 330, 60, 500, 500, 490);
      ocean.addColorStop(0, mode === "solutions" ? "#92b9bc" : "#809a9d");
      ocean.addColorStop(0.5, mode === "solutions" ? "#4c7e8b" : "#476571");
      ocean.addColorStop(1, "#173b49");
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fillStyle = ocean;
      ctx.fill();
      if (land) {
        ctx.beginPath();
        path(land);
        ctx.fillStyle = "rgba(220,232,210,.08)";
        ctx.fill();
        ctx.beginPath();
        for (const coordinates of dots) {
          if (!visibleOnGlobe(coordinates[0], coordinates[1], center)) continue;
          const point = projection(coordinates);
          if (point) {
            ctx.moveTo(point[0] + 1.6, point[1]);
            ctx.arc(point[0], point[1], 1.6, 0, Math.PI * 2);
          }
        }
        ctx.fillStyle = "rgba(221,235,213,.86)";
        ctx.fill();
      }
      ctx.beginPath();
      path(geoGraticule10());
      ctx.strokeStyle = "rgba(215,234,226,.14)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
      if (mode === "problems") {
        for (const zone of riskZones) {
          if (!layers[zone.type]) continue;
          ctx.beginPath();
          path(geoCircle().center(zone.coordinates).radius(zone.radius)());
          ctx.fillStyle =
            zone.type === "climate"
              ? "rgba(215,148,74,.45)"
              : "rgba(191,77,77,.55)";
          ctx.fill();
          ctx.strokeStyle = zone.type === "climate" ? "#d5a361" : "#d98780";
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      }
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.strokeStyle = "rgba(178,209,214,.7)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(element);
    return () => observer.disconnect();
  }, [projection, dots, land, center, mode, layers]);

  const active =
    projects.find((project) => project.slug === hovered) || projects[0];
  const activeRisk = riskZones.find((zone) => zone.id === risk) || riskZones[0];
  return (
    <div className="globe-scene">
      <div className="globe-container">
        <canvas
          ref={canvas}
          className="globe-canvas"
          role="img"
          aria-label={`Earth rotated ${Math.round(rotation)} degrees, showing ${mode === "solutions" ? "project locations" : "illustrative climate and conflict layers"}. Project links are also available below.`}
        />
        {mode === "solutions" &&
          projects
            .filter(
              (project) =>
                statuses[project.status] &&
                visibleOnGlobe(...project.coordinates, center),
            )
            .map((project) => {
              const point = projection(project.coordinates)!;
              return (
                <Link
                  key={project.slug}
                  to={`/projects/${project.slug}`}
                  className={`globe-marker ${project.status}`}
                  style={{
                    left: `${point[0] / 10}%`,
                    top: `${point[1] / 10}%`,
                  }}
                  aria-label={`Open report: ${project.title}${project.sample ? " (sample proposal)" : ""}`}
                  onMouseEnter={() => setHovered(project.slug)}
                  onFocus={() => setHovered(project.slug)}
                >
                  <span className="marker-core" />
                  <span className="marker-label">{project.title}</span>
                </Link>
              );
            })}
        {mode === "problems" &&
          riskZones
            .filter(
              (zone) =>
                layers[zone.type] &&
                visibleOnGlobe(...zone.coordinates, center),
            )
            .map((zone) => {
              const point = projection(zone.coordinates)!;
              return (
                <button
                  key={zone.id}
                  type="button"
                  className={`risk-marker ${zone.type}`}
                  style={{
                    left: `${point[0] / 10}%`,
                    top: `${point[1] / 10}%`,
                  }}
                  aria-label={`Read illustrative layer: ${zone.title}`}
                  onClick={() => setRisk(zone.id)}
                >
                  {zone.type === "climate" ? "≈" : "!"}
                </button>
              );
            })}
      </div>
      <div className="globe-summary" aria-live="polite">
        <span className="eyebrow">
          {mode === "solutions" ? active.location : "Illustrative layer"}
        </span>
        <h3>{mode === "solutions" ? active.title : activeRisk.title}</h3>
        {mode === "solutions" ? (
          <Link to={`/projects/${active.slug}`} className="text-link">
            Read the full report <span>↗</span>
          </Link>
        ) : (
          <p>{activeRisk.description}</p>
        )}
      </div>
      {mapError && (
        <p className="map-message" role="status">
          The geographic layer could not load. Project reports remain available
          below.
        </p>
      )}
    </div>
  );
}
