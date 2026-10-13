# Application structure

`src/main.tsx` mounts React and the browser router. `src/App.tsx` owns navigation, scroll restoration, page routes and the footer.

On the homepage, `EarthSection` computes scroll progress from the section bounds. Its sticky viewport remains in place across the long scroll section; progress maps to exactly 360 degrees. That angle, the atlas mode and selected layers are passed to `Globe`. The rotation is driven by the scroll position, not by a timer. A mode change updates the layer state without resetting progress.

`Globe` loads the local TopoJSON coastline asset once, converts it to GeoJSON and constructs a dotted land layer. D3's orthographic projection maps longitude/latitude to the apparent sphere. The same projection positions project buttons and clips risk circles. Only points in the visible hemisphere are clickable. The native canvas needs no WebGL or Three.js dependency.

Project content lives in `src/data/projects.ts`. Both homepage cards and globe markers point to `/projects/:slug`. `ProjectReport` resolves that slug and renders the narrative, local images, sources and `PowerBIReport`. Adding a project automatically creates its report route. Unknown slugs produce a visible not-found page.

`PowerBIReport` permits HTTPS iframe URLs on the exact `app.powerbi.com` hostname and the supported `/view` and `/reportEmbed` paths. Empty or invalid configuration produces a visible explanatory state. Authentication for secure iframe reports remains with Microsoft. This application does not provide an authentication backend, analytics database or embed-token endpoint.

## Next extensions

- Replace illustrative risk circles with real, dated geographic polygons and clearly defined metrics.
- Replace TypeScript content records with a CMS or backend while keeping the `Project` shape at the interface boundary.
- Add backend contact submissions and an authorised donation checkout.
- For app-owns-data Power BI embedding, add a server endpoint that obtains short-lived embed tokens; use the official client SDK without exposing server credentials.

## Accessibility

The selector uses pressed-state buttons, layers use labelled native checkboxes and markers are links with accessible names. All reports also appear in the homepage's project sections. A skip link bypasses navigation, the atlas has a skip-to-projects link, and reduced-motion preferences disable scroll rotation and the long pinned journey.
