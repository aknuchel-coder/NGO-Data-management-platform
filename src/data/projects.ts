export type ProjectStatus = "notable" | "upcoming" | "potential";
export interface Project {
  slug: string;
  title: string;
  category: string;
  location: string;
  coordinates: [number, number]; // longitude, latitude; approximate example locations
  status: ProjectStatus;
  organisation: string;
  summary: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  challenge: string;
  response: string;
  sections: { title: string; text: string }[];
  gallery: { src: string; alt: string; caption: string }[];
  sources: { label: string; url: string }[];
  powerBi: { embedUrl: string; kind: "public" | "secure"; description: string };
  sample: boolean;
}

const base = {
  imageCaption:
    "Original illustration · replace with licensed project photography.",
  gallery: [
    {
      src: "/images/fieldwork.svg",
      alt: "Illustrated landscape with terraces and a river",
      caption:
        "Illustrative fieldwork scene. Add actual project photos and captions here.",
    },
  ],
  powerBi: {
    embedUrl: "",
    kind: "secure" as const,
    description: "Project outcomes, resources and delivery progress.",
  },
};

export const projects: Project[] = [
  {
    ...base,
    slug: "mosul",
    title: "Revive the Spirit of Mosul",
    category: "Cultural heritage",
    location: "Mosul, Iraq",
    coordinates: [43.13, 36.34],
    status: "notable",
    organisation: "UNESCO",
    image: "/images/mosul.svg",
    imageAlt: "Illustration of arches and a minaret in Mosul",
    sample: false,
    summary:
      "Restoring cultural landmarks and reconnecting communities through the places they share.",
    challenge:
      "Conflict damaged cultural and religious landmarks in Mosul, affecting places central to the city’s shared life.",
    response:
      "UNESCO’s initiative rehabilitated landmark sites with the Iraqi Government and local communities.",
    sections: [
      {
        title: "The place and its people",
        text: "The initiative brings cultural heritage into a broader effort to revive Mosul. Its landmark work includes Al-Nouri Mosque, Al-Hadba Minaret, Our Lady of the Hour Convent and Al-Tahera Church.",
      },
      {
        title: "What the source establishes",
        text: "UNESCO reports that reconstruction of these landmarks was completed in January 2025. This example report summarises that source; it does not provide new impact measurements or claim that Earth / Action delivered the work.",
      },
      {
        title: "What belongs in a full project report",
        text: "Add the implementing partner’s detailed narrative, a dated budget, delivery milestones, monitoring methodology, photographs with permissions, and the underlying datasets for the dashboard below.",
      },
    ],
    sources: [
      {
        label: "UNESCO · Revive the Spirit of Mosul: Heritage",
        url: "https://www.unesco.org/en/revive-mosul/heritage",
      },
    ],
  },
  {
    ...base,
    slug: "great-green-wall",
    title: "The Great Green Wall",
    category: "Land restoration",
    location: "Sahel, Africa",
    coordinates: [-15, 15],
    status: "notable",
    organisation: "African Union / UNCCD",
    image: "/images/sahel.svg",
    imageAlt:
      "Illustration of trees and restored fields across a dry landscape",
    sample: false,
    summary:
      "An African-led effort to restore degraded landscapes and strengthen communities across the Sahel.",
    challenge:
      "Degraded landscapes and pressures on livelihoods make land restoration a shared priority across the Sahel.",
    response:
      "The Great Green Wall brings together countries and partners to restore landscapes and support communities.",
    sections: [
      {
        title: "A landscape-scale initiative",
        text: "Launched in 2007 by the African Union, the initiative aims to restore degraded landscapes across the Sahel. The map point is an approximate regional reference, not the boundary of the programme.",
      },
      {
        title: "Understanding progress",
        text: "A useful report separates programme-wide ambitions from verified outcomes at a particular project site. Attach dated evidence and define the area, method and baseline for every restoration metric.",
      },
      {
        title: "From overview to evidence",
        text: "Replace this short source-based overview with a specific partner report, including local activities, community participation, expenditure and monitoring results.",
      },
    ],
    sources: [
      {
        label: "UNCCD · Great Green Wall Initiative",
        url: "https://www.unccd.int/our-work/ggwi",
      },
    ],
  },
  {
    ...base,
    slug: "solar-for-health",
    title: "Solar power for healthcare",
    category: "Renewable energy",
    location: "Yemen",
    coordinates: [44.2, 15.35],
    status: "notable",
    organisation: "UNDP",
    image: "/images/solar.svg",
    imageAlt: "Illustration of solar panels beside a healthcare building",
    sample: false,
    summary:
      "Reliable renewable power helps healthcare facilities keep essential services available.",
    challenge:
      "Healthcare facilities need reliable energy to deliver essential services in difficult conditions.",
    response:
      "UNDP-supported solar energy systems strengthen the operational capacity of healthcare facilities in Yemen.",
    sections: [
      {
        title: "Power where it matters",
        text: "UNDP describes solar energy support for hospitals in Yemen, including facilities in Hajjah and Sana’a Governorate. This map point represents a country example rather than every installation.",
      },
      {
        title: "How to report the results",
        text: "A complete operational report can document installed capacity, service availability, maintenance arrangements and measured energy performance. Those measurements are not supplied in this starter.",
      },
      {
        title: "Keep the evidence connected",
        text: "Add installation photographs, dated monitoring records and the implementing partner’s report. Connect a Power BI report only after its underlying figures are verified.",
      },
    ],
    sources: [
      {
        label:
          "UNDP · Solar power brings renewable energy to hospitals in Yemen",
        url: "https://www.undp.org/arab-states/stories/solar-power-brings-renewable-energy-hospitals-yemen",
      },
    ],
  },
  {
    ...base,
    slug: "community-restoration",
    title: "Community-led restoration",
    category: "Local resilience",
    location: "Region to be confirmed",
    coordinates: [29, -2],
    status: "upcoming",
    organisation: "Partner to be confirmed",
    image: "/images/sahel.svg",
    imageAlt: "Illustrated green landscape",
    sample: true,
    summary:
      "A sample proposal showing how planned work moves from local need to a delivery plan.",
    challenge:
      "Define the local problem with the community and collect a dated baseline.",
    response:
      "Confirm a partner, the scope of work, a budget and the next delivery milestone.",
    sections: [
      {
        title: "Next milestone",
        text: "Confirm the local implementing partner, project location and delivery date. This is a sample proposal, not an announced programme.",
      },
      {
        title: "Before work begins",
        text: "Document feasibility, community participation, procurement and monitoring responsibilities.",
      },
    ],
    sources: [],
  },
  {
    ...base,
    slug: "land-under-pressure",
    title: "Land under pressure",
    category: "Climate adaptation",
    location: "Illustrative Sahel location",
    coordinates: [9, 17],
    status: "potential",
    organisation: "Proposed concept",
    image: "/images/sahel.svg",
    imageAlt: "Illustrated dry land and young trees",
    sample: true,
    summary:
      "Explore local restoration and water stewardship as a response to degraded land.",
    challenge:
      "A potential project starts by establishing where land degradation is occurring and what local people need.",
    response:
      "Assess local restoration and water stewardship approaches before committing to a programme.",
    sections: [
      {
        title: "Evidence needed",
        text: "Collect land-condition measurements, water information and local priorities. The geographic point is illustrative.",
      },
      {
        title: "Feasibility comes first",
        text: "Assess tenure, local capacity, maintenance and funding. This concept has no confirmed delivery partner.",
      },
    ],
    sources: [],
  },
  {
    ...base,
    slug: "places-at-risk",
    title: "Places at risk",
    category: "Heritage protection",
    location: "Location to be assessed",
    coordinates: [35, 33],
    status: "potential",
    organisation: "Proposed concept",
    image: "/images/mosul.svg",
    imageAlt: "Illustrated historic arches",
    sample: true,
    summary:
      "Protect shared heritage through a response shaped by the people connected to it.",
    challenge:
      "Confirm the site’s condition, the relevant threats and the priorities of the community.",
    response:
      "Assess documentation, stabilisation or protection measures with qualified local partners.",
    sections: [
      {
        title: "Begin with the place",
        text: "Verify the location, assess conditions and gather documentation. This sample does not describe a live conflict event.",
      },
      {
        title: "A responsible response",
        text: "Plan with local stakeholders and qualified heritage specialists before selecting an intervention.",
      },
    ],
    sources: [],
  },
  {
    ...base,
    slug: "essential-services",
    title: "Essential services",
    category: "Resilient infrastructure",
    location: "Location to be assessed",
    coordinates: [32, -15],
    status: "potential",
    organisation: "Proposed concept",
    image: "/images/solar.svg",
    imageAlt: "Illustrated solar power installation",
    sample: true,
    summary:
      "Explore dependable local power for healthcare and other essential community services.",
    challenge:
      "Establish the service’s energy demand, interruptions and maintenance capacity.",
    response:
      "Evaluate resilient power options and a realistic plan for long-term operation.",
    sections: [
      {
        title: "Understand the demand",
        text: "Collect the baseline energy demand, service requirements and interruption records.",
      },
      {
        title: "Design for operation",
        text: "Evaluate maintenance, training and lifecycle cost alongside installation. This is an unconfirmed sample concept.",
      },
    ],
    sources: [],
  },
];

export const projectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
