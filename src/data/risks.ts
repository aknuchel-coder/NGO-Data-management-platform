export interface RiskZone {
  id: string;
  type: "climate" | "conflict";
  title: string;
  coordinates: [number, number];
  radius: number;
  description: string;
}

// Illustrative design data. Replace with sourced, dated GeoJSON before publishing real risk information.
export const riskZones: RiskZone[] = [
  {
    id: "drylands",
    type: "climate",
    title: "Dryland pressures",
    coordinates: [14, 17],
    radius: 13,
    description:
      "Illustrative climate layer. A real layer needs a defined metric, unit, baseline, reporting period and source.",
  },
  {
    id: "rainfall",
    type: "climate",
    title: "Rainfall variation",
    coordinates: [103, 21],
    radius: 12,
    description: "Illustrative climate layer, not a measurement or forecast.",
  },
  {
    id: "forest",
    type: "climate",
    title: "Landscape change",
    coordinates: [-57, -9],
    radius: 14,
    description:
      "Illustrative geographic area. No current environmental event is asserted.",
  },
  {
    id: "conflict-a",
    type: "conflict",
    title: "Conflict context A",
    coordinates: [36, 47],
    radius: 6,
    description:
      "Illustrative conflict layer. Replace with verified event data and a visible reporting period.",
  },
  {
    id: "conflict-b",
    type: "conflict",
    title: "Conflict context B",
    coordinates: [43, 29],
    radius: 7,
    description:
      "Illustrative conflict layer, not a current conflict boundary or incident report.",
  },
];
