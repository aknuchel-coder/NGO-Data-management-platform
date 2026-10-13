# Earth / Action

A local React + TypeScript website for an interactive project atlas. Scroll through one full globe rotation, switch between Solutions and Problems, and open full project report pages with images, narrative sections, sources and a configurable Power BI dashboard.

The page follows the structure, palette and editorial direction of the [Figma concept](https://www.figma.com/design/HcfXPke8xLj31W4Sm7bWG1). Figma's export quota blocked a fresh design-context extraction; this is an independent implementation of the agreed concept, not a generated or pixel-exact Figma export.

## Run in VS Code

Install Node.js 22.12 or newer (Node 24 is suitable). Unzip the project and open the `earth-action` folder in VS Code. In its integrated terminal:

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite, normally **http://127.0.0.1:5173**. Stop the server with Ctrl+C.

```bash
npm test
npm run build
npm run preview
```

`build` type-checks the source and creates the static production website in `dist/`. `preview` normally serves it at http://127.0.0.1:4173.

## What works

- A sticky globe driven continuously by scroll progress: 0–360°, then the page continues. Reverse scrolling reverses the rotation.
- Real geographic coastlines bundled locally, with geographic project markers that disappear behind the Earth.
- Solutions / Problems switching preserves the globe angle and scroll position.
- Project status filters and independently selectable climate/conflict layers.
- Clickable globe markers and project cards open `/projects/:slug` report pages.
- Reports contain images, captions, text sections, a challenge/response summary, source links, related projects and Power BI embedding.
- Responsive layouts, local fonts, keyboard controls, browser navigation and a reduced-motion alternative.

## Files to edit

| File                               | Purpose                                                               |
| ---------------------------------- | --------------------------------------------------------------------- |
| `src/data/projects.ts`             | Project locations, report text, images, sources and Power BI URLs.    |
| `src/data/risks.ts`                | Illustrative problem layers. Replace with sourced, dated information. |
| `src/data/site.ts`                 | Contact email, authorised donation links and brand name.              |
| `src/pages/HomePage.tsx`           | Sections below the globe.                                             |
| `src/pages/ProjectReport.tsx`      | Full report page layout.                                              |
| `src/components/EarthSection.tsx`  | Scroll progression, selector and layer/status controls.               |
| `src/components/Globe.tsx`         | Canvas globe, projection, markers and risk rendering.                 |
| `src/components/PowerBIReport.tsx` | Dashboard embed and unconfigured state.                               |
| `src/styles.css`                   | Design tokens, desktop/mobile layouts and motion preferences.         |
| `public/images/`                   | Local report and card imagery.                                        |
| `public/data/land-110m.json`       | Locally bundled world coastlines.                                     |

## Add a project report

Add an object following the `Project` type in `src/data/projects.ts`. Its unique `slug` becomes its URL. Coordinates are `[longitude, latitude]`, in degrees. Status determines where it appears on the homepage: `notable`, `upcoming` or `potential`.

Store photos under `public/images/` and refer to them as `/images/your-photo.jpg`. Add descriptive alternative text, photographer credits, usage permissions and captions. The existing SVGs are original **illustrations**, not documentary photographs.

Add narrative blocks to `sections`. React renders text as text rather than injecting raw HTML. Reports are automatically available from project cards and globe markers.

## Connect Power BI

Each project has this configuration:

```ts
powerBi: {
  embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID&autoAuth=true&ctid=YOUR_TENANT_ID',
  kind: 'secure',
  description: 'Describe what this dashboard measures.',
}
```

Paste the **iframe `src` URL** obtained from Power BI's **Embed report → Website or portal** option, not the complete iframe HTML. Secure embedding retains Microsoft sign-in, permissions and applicable licensing requirements.

For data intentionally published to everyone, Power BI's **Publish to web** option supplies a `https://app.powerbi.com/view?r=...` URL; use `kind: 'public'`. Publish to web makes the report public. Do not use that option for private information.

No Power BI report URL was supplied, so the starter deliberately shows an unconnected state. Its decorative preview is not a real dashboard. Invalid URLs are rejected; the narrative still renders. Do not place access tokens, client secrets or passwords in the project data or browser environment variables. An app-owns-data Power BI Embedded integration needs a backend to obtain embed tokens and is a separate extension.

Official guidance: [secure embedding](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-embed-secure) · [Publish to web](https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-publish-to-web).

## Content and integrations

Three notable cards reference external UNESCO, UNCCD and UNDP initiatives. Their short reports summarise the linked sources and claim no affiliation. Upcoming/potential projects and all risk overlays are explicitly illustrative. Replace them with your own verified content before presenting them as actual programmes or current climate/conflict data.

Donation amount buttons work as a selection preview; no money is collected. Add authorised destinations to `site.donations` to offer outbound donation links. Selected amounts are not transmitted to those destinations. A checkout and financial reporting backend are not included.

Set `site.contactEmail` to open an email draft from the contact form. This does not send mail automatically or store submissions. Leave it empty for the honest preview state; add an API if you want direct submission later.

## Deployment and embedding in another project

Upload `dist/` to a static host and configure a fallback rewrite to `index.html` for `/projects/*` and other frontend routes. This allows report links to work on a direct visit or refresh. No deployment is performed by this repo.

To move the interface into an existing React app, reuse the components, data, assets, fonts and CSS. The project uses React Router's `BrowserRouter`; integrate its routes into your app's existing router rather than nesting another browser router. The root-relative assets assume deployment at `/`; adjust asset paths and router basename for a subdirectory.

## Validation

`npm test` checks the scroll-to-angle mapping, far-side marker visibility, report data/assets and Power BI URL validation. `npm run build` type-checks and builds the application. Browser checks performed during creation are recorded in `docs/VALIDATION.md`.

For the optional browser suite, install its browser once, then run:

```bash
npx playwright install chromium
npm run test:browser
```

The suite starts a local development server when necessary and writes screenshots to `test-results/`. It tests Power BI using a mocked report response; no real Microsoft report is accessed.

See `docs/ARCHITECTURE.md` for the component flow and extension points. See `THIRD_PARTY.md` for geographic data and font attribution.
