# UniversalExpand

An offline-capable, browser-based 3D educational universe simulation and cited research notebook.

## Open

Double-click `dist/index.html` to run directly in a modern browser. All simulation assets are local; no install or external libraries are needed. The references open external scientific sources.

Alternatively, with Node.js installed, run `node serve.cjs` from this folder and open http://127.0.0.1:4173. The server binds only to this computer.

## Controls

- Drag the 3D window or use arrow keys to orbit; scroll or use + / - to zoom.
- Choose a circular numbered marker or chapter, or scrub the history control.
- Play/pause and change pace; playback stops at today.
- Change observer to move the coordinate origin.
- Inspect material cards, the 118-element atlas, the expansion laboratory and particle processes.
- Search elements by name, symbol, or atomic number. The table uses conventional periodic positions and keeps its layout stable when selection changes. On phones, scroll the table sideways or use search and the link to selected details.
- Use arrow keys inside the atlas, and Enter/Space to select. Calculated numbers automatically follow your browser’s regional conventions. The scientific text is in English.
- Read `dist/research.html` for the complete cited notebook and model limitations.
- Read `dist/guide.html` for controls, glossary, accessibility, privacy and offline behavior.

Read `SCIENTIFIC_REVIEW.md` for the journal-based scientific audit, corrections, unresolved questions and numerical validation (10 September 2026).

## Scientific scope

The numerical background integrates a flat radiation + matter + cosmological-constant model. Displayed late-time a, z and CMB temperature derive from this background. Galaxy assembly and reaction animations are illustrative, not N-body, hydrodynamical or quantum reaction calculations. Cosmic distances and chapter time intervals are compressed. The circular window is not the edge of the universe.

## Files

- dist/index.html: simulation interface
- dist/styles.css: responsive styling
- dist/science.js: chronology, material pathways, elements and cosmology integrator
- dist/universe.js: controls and WebGL renderer
- dist/atlas.js: periodic table, element search and keyboard navigation
- dist/research.html: research notebook and 29 references
- dist/guide.html: user guide, glossary and privacy information
- serve.cjs: optional dependency-free local HTTP server
- verify.cjs: numerical and interface contract checks
- verify-server.cjs: HTTP behavior and security regression checks
- AUDIT.md: review findings, evidence and prioritized release recommendations

WebGL and hardware acceleration are needed for 3D. The scientific text and atlas remain available if WebGL is unavailable. No deployment or external account is required.

## Verification

Run `node verify-science.cjs`, `node verify.cjs` and `node verify-server.cjs` from this folder. All use Node built-ins and need no package install. The first uses a lightweight DOM stub and does not replace real-browser testing. The audit records the browser checks performed.

## Distribution and international readiness

The contents of `dist` can be distributed together as an offline application or served by a static HTTPS host. There is no bundling step. `serve.cjs` is a loopback-only preview server, not a production hosting service. A hosted visit alone does not provide guaranteed offline access; download all the files for offline use.

Calculated numbers follow the browser’s default locale automatically. No preferences are saved in browser storage. The interface is English; number formats are not language translations. Reviewed translations, real-device/assistive-technology validation, hosting configuration and distribution licensing remain release work documented in AUDIT.md.
