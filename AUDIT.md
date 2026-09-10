# UniversalExpand application audit

Reviewed 10 September 2026. Scope: all supplied HTML, CSS and JavaScript, the numerical model's existing checks, local serving behavior, and primary browser flows. This is an engineering and usability review, not independent scientific peer review, legal clearance, or accessibility certification.

## Result

The reported periodic-table movement is fixed. The application now has a conventional periodic arrangement, stable selection geometry, searchable elements, keyboard navigation, improved small-screen behavior, regional numeric formatting, lower idle graphics work, and an accessible reading guide. It remains an English-language local application. A global production release still needs the deployment and validation decisions below.

## Findings and completed changes

| Priority | Finding | Resolution |
| --- | --- | --- |
| High | Element descriptions changed the height of the adjacent auto-sized grid. Selecting lithium changed the grid from 372.70 to 391.89 CSS pixels in the original desktop layout. | Explicit 54px cell rows, a grid aligned at its start, a bounded independently scrollable detail panel, stable scrollbar space, and no scroll anchoring inside the atlas layout. Selection neither removes cells nor changes their positions. |
| High | Elements were arranged as a continuous sequence of 18 cells, or 9 on phones, obscuring periodic structure. | Conventional 18-group positions; detached complete 57–71 and 89–103 rows with placeholders in periods 6 and 7. Group numbers and explanatory text distinguish atomic numbers from atomic weights. |
| High | Narrow screens could overflow and the atlas required scanning 118 entries. | Contained horizontal scrolling, search by English name/symbol/number, accepted spelling variants, explicit empty state, clear search, and a direct link to selected details. Matching does not reflow the table. |
| Medium | Tab controls lacked complete tab semantics; element controls added 118 sequential keyboard stops. | Named tab panels, selected state, roving tab focus, manual arrow-key tab activation, roving element focus, Home/End and directional movement, selection announcement, and focusable detail reading area. |
| Medium | Accessibility and discoverability gaps. | Skip links, visible focus for links/disclosures/SVG chapter buttons, labeled reaction progress, descriptive cosmic-time slider values, larger controls, mobile zoom buttons, reduced-motion CSS, and forced-colors selection outlines. |
| Medium | Calculated values mixed browser-localized output with fixed decimal formatting. | A shared cached Intl.NumberFormat utility for calculated ages, temperature, scale factor, redshift and laboratory values. Calculated numbers automatically follow the browser default. The number-format selector and persistence were subsequently removed at the user’s request. Scientific symbols, static equations and prose remain in English. |
| Medium | The renderer regenerated 13,720 particle positions each frame even when nothing changed. | Scene rendering is skipped when its input state is unchanged; changed scenes are capped at approximately 30 frames per second. No battery-life or frame-rate improvement percentage is claimed. |
| Medium | Hidden-page playback and switching away from reactions were confusing. | Backgrounding pauses both timelines; leaving the process panel pauses its reaction. Full-screen labeling follows actual full-screen state. |
| Medium | Graphics failure could interrupt initialization or leave an unexplained blank view. | Guarded context creation and a visible context-loss message. Non-graphics controls remain usable. Context loss explicitly asks for reload; automatic GPU recovery is not implemented. |
| Medium | Local preview server accepted arbitrary methods and lacked defensive response headers. | GET/HEAD restriction, malformed-path rejection, containment checks, MIME sniffing protection, referrer policy, CSP, and correct HEAD behavior. It remains bound to loopback. |
| Medium | No consolidated controls, glossary, privacy or offline explanation. | Added a guide covering input methods, scientific terms, language limits, local storage, external references and the difference between downloaded offline use and hosted caching. |

## Verification performed

- `node verify.cjs`: passes numerical age/temperature checks, monotonic cosmology, all 12 chapter transitions, play/pause, observer scaling, all four tabs, four reaction pathways, all 118 detail entries and local links. New checks cover unique periodic coordinates and known reference positions, spelling variants, empty search, invalid selection, keyboard movement, German/Arabic numeric output, storage-unavailable fallback, reaction switching and background pause. These checks use a DOM stub with WebGL unavailable.
- `node verify-server.cjs`: passes assets, headers, HEAD responses, unsupported methods, malformed escapes/NUL, traversal attempts with slash/backslash and missing resources.
- Syntax checks passed for the changed application scripts.
- Real browser: all four panels checked at viewport widths 320, 390, 768, 1024 and 1440 CSS pixels. Document scroll width equaled document client width at all 20 combinations. The periodic table has intentional internal horizontal scrolling on narrow screens.
- Real browser: hydrogen, lithium, beryllium, iron, technetium, gold, uranium and oganesson retained the same grid document position, 536px grid height, 54px first-cell height and 520px desktop detail height across selection. The measurements establish geometry stability, not a production Core Web Vitals score.
- Real browser: aluminum search selected aluminium; a nonsense query displayed the empty state; clearing search restored matches; ArrowDown from hydrogen focused lithium and Enter selected it. German laboratory separators displayed correctly and the preference survived reload; it was reset to Browser default afterward. This records the original audit; the selector and persistence were subsequently removed at the user’s request.
- Browser inspection after the new response headers showed no console errors. Desktop and phone atlas layouts were visually inspected.

Limits: testing used the connected Chromium browser and viewport emulation, not physical iOS/Android devices, Safari/Firefox, a screen reader, a slow-network lab or a formal WCAG audit. Scientific checks confirm internal model consistency rather than validating every scientific statement independently.

## Prioritized next work for a global release

1. **Reviewed language editions.** Extract prose and UI strings into language dictionaries, choose supported locales based on the intended audience, translate all scientific explanations and the notebook together, and commission fluent scientific review. Add an actual language switcher and RTL layout tests only when those editions exist. Number formatting alone is not translation.
2. **Production distribution.** Select a static HTTPS host/domain, apply equivalent security headers at that host, decide cache/update policies, provide a useful 404 page and verify deployment from more than one region. The supplied local preview server should not be exposed as a public service. Settle distribution license, copyright attribution, owner/contact details and external-asset permissions before publication; none are invented here.
3. **Real-device and assistive-technology acceptance.** Test Safari/iOS, Firefox, Chrome/Android, NVDA and VoiceOver, 200–400% zoom, forced colors, reduced motion, GPU loss and denied storage. Include a low-powered device and long translated labels. Resolve observed issues before making an accessibility conformance claim.
4. **Richer element evidence.** Add isotope-aware origin references and sourced standard atomic weights with their uncertainty conventions and dataset review dates. IUPAC/CIAAW data need careful treatment; bracketed mass numbers must not be presented as universal average atomic weights. Avoid invented precise production dates or simplistic single-origin claims.
5. **Reproducible classroom exploration.** Add shareable chapter/element/laboratory URLs with validated parameters, a small set of guided questions, and a printer-friendly lesson page. Keep each educational claim linked to the notebook. This is a better next feature than an account system for the current local-first product.
6. **Optional hosted offline installation.** If a hosted offline experience is desired, add a versioned service worker with an explicit update strategy and stale-content tests. The current downloadable application already works offline; service-worker caching should not silently freeze outdated scientific content.
7. **Maintainability.** Continue separating UI, renderer and scientific datasets into readable modules while retaining the dependency-free distribution. Add reproducible browser layout tests to CI when a repository and browser-test environment are established.

## Research used

- [MDN: scrollbar-gutter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-gutter) explains reserving scrollbar space to avoid width changes. This supports the gutter treatment; explicit grid rows address the separate measured height change.
- [W3C: Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) informs tab/tabpanel relationships and keyboard interaction.
- [W3C: target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) describes minimum target size and spacing. The app uses larger touch controls where practical; this does not establish whole-application conformance.
- [W3C: declaring language in HTML](https://www.w3.org/International/questions/qa-html-language-declarations.html) supports truthful document language metadata. English remains declared because the scientific text is English.
- [MDN: Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) supports locale-sensitive numeric presentation.
- [IUPAC: periodic table of elements](https://iupac.org/what-we-do/periodic-table-of-elements/) supplies authoritative element nomenclature and pointers to standard atomic-weight data. The application currently displays names, symbols and atomic numbers, not atomic-weight estimates.

The existing notebook remains the source index for the cosmology, element-origin and particle-process explanations. This audit deliberately preserves its distinctions between evidence, illustrative models and unresolved questions.
