# Validation

Validated during creation on 7 October 2026.

## Passed

- TypeScript strict type-check and Vite production build.
- Four unit-test groups: scroll-to-angle/clamping, visible hemisphere/full-turn return, Power BI URL validation, and unique report routes with existing local imagery.
- Browser checks at 1440 × 900 and 390 × 844.
- Globe angle reaches 180° at the middle and 360° at the end of the pinned span.
- Solutions / Problems switching preserves scroll position.
- Disabling a climate layer removes its selectable markers.
- Clicking a globe project marker opens the correct full report URL.
- Report imagery loads; direct report reloads work on the development server.
- Unknown project routes show a not-found state.
- Skip-to-projects bypasses the long globe journey.
- Donation amount selection and the unconnected donation/contact states behave honestly.
- Reduced-motion preferences remove the pinned journey and rotation.
- No horizontal page overflow on the tested mobile homepage/report page.
- A configured Power BI iframe renders and receives the supplied URL, verified with a mocked response.
- No browser runtime errors in the tested flows.
- Desktop homepage and full report screenshots were visually inspected; the mobile homepage was also inspected.

## Limits

- No real Power BI embed URL or Microsoft credentials were provided. Actual report access, Microsoft sign-in, tenant policy, data correctness and licensing were not tested.
- No donation checkout or contact submission service is connected.
- The risk layers and proposed projects remain illustrative.
- The Figma extraction quota blocked a new design-context export; exact visual parity is not claimed.
- Static production hosting must configure an index.html fallback for report URLs.

Run `npm test`, `npm run build`, and optionally `npm run test:browser` to repeat the checks. The browser suite uses a local development server and a simulated Power BI response.
