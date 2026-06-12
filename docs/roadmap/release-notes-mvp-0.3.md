# Release Notes: MVP 0.3

MVP 0.3 turns the Be Knowledgeable Platform from a rough MVP into a more organized collaborative prototype. The focus is still simple: Markdown content, a React/Vite frontend, a FastAPI backend, optional AI support, and a lightweight Archive of Sparks learning narrative.

## 1. What MVP 0.3 Adds

- Reusable content templates in `docs/templates/`:
  - Knowledge article template.
  - Learning method template.
  - Experience lesson template.
  - Archive of Sparks scene template.
  - Reading note template.
- Improved contribution workflow:
  - Expanded `CONTRIBUTING.md`.
  - Added `docs/governance/contribution-system.md`.
  - Added example Computer Science content and Archive of Sparks scene JSON.
- Simple Markdown content search:
  - Backend endpoint: `GET /api/content/search?q=...`.
  - Knowledge page search box.
  - Search results open Markdown content pages.
- Deployment helper scripts:
  - `scripts/dev.sh`
  - `scripts/build.sh`
  - `scripts/check.sh`
- MVP 0.3 roadmap documentation.

## 2. What Was Improved From MVP 0.2

- Algorithms section is now structured for MVP 0.3:
  - Added an Algorithms landing page.
  - Added an Algorithms index with chapters for complexity, data structures, sorting/searching, divide and conquer, dynamic programming, greedy algorithms, graph algorithms, optimization, modern AI systems, and real-world platform algorithms.
- Computer Science entry page now feels like a real field entrance:
  - Explains what Computer Science studies.
  - Explains why ordinary people should learn it.
  - Connects technical branches to the platform mission.
- Archive of Sparks Chapter 0 is easier to expand:
  - Scene data moved into JSON under `content/works/archive-of-sparks/scenes/`.
  - Delivery Worker scene can be loaded by the React page.
  - Scene structure is now closer to a reusable chapter framework.
- Archive of Sparks now includes a learning output step:
  - Players can write a short learning note.
  - Notes are stored in localStorage by scene ID.
  - Notes can be edited after refresh.
  - Optional AI improvement can help refine the note.
- Frontend API access is more centralized:
  - API base URL uses `VITE_API_BASE_URL`.
  - Frontend has helper functions for tutor, annotation improvement, character chat, Markdown loading, content index, and search.
- Knowledge page is more dynamic:
  - Loads Markdown content index from the backend.
  - Displays dynamic content cards.
  - Supports simple search.

## 3. What Still Does Not Work

- There is no user account system.
- There is no backend database for annotations or learning notes.
- Search is keyword-based only; there are no embeddings, ranking models, or advanced filters.
- Archive of Sparks is still a lightweight web narrative, not a full game engine.
- Factory Worker and Student identities are still placeholders.
- Mainstream economics and state/institutions routes are still mostly placeholders.
- There is no full production deployment automation yet.
- There is no complete CI pipeline.
- AI quality depends on backend configuration and provider availability.

## 4. Known Limitations

- localStorage data stays only in the current browser.
- AI can be disabled, unavailable, rate-limited, or provider-dependent.
- Markdown content still needs sources, examples, and review.
- Some legacy repository routes coexist with newer Markdown routes.
- The current content index and search scan files directly; this is fine for MVP scale but not a long-term search architecture.
- Deployment scripts are helpers for development and MVP checks, not production orchestration.
- Contribution workflow is intentionally lightweight and may need more structure as the project grows.

## 5. How Contributors Can Help Next

- Use the templates in `docs/templates/` to add new content pages.
- Improve Algorithms chapters with examples, diagrams, exercises, and references.
- Add Computer Science pages for programming, systems, networks, databases, software engineering, AI, security, and HCI.
- Expand Archive of Sparks scenes using the scene JSON pattern.
- Review content for clarity, accuracy, and source quality.
- Improve search result snippets and filtering.
- Add tests for backend content endpoints and frontend routing.
- Try the deployment helper scripts on a clean machine and report missing steps.
- Open issues for unclear docs, broken links, missing sources, or confusing setup steps.

## 6. Next Target: MVP 0.4

MVP 0.4 should focus on making the platform more reliable and more usable for real collaborators.

Possible MVP 0.4 targets:

- Add lightweight automated tests.
- Improve content metadata with frontmatter.
- Add better search filters by category or tag.
- Add more complete Archive of Sparks chapter framework documentation.
- Add a small persistent backend storage option for annotations and learning notes.
- Improve deployment documentation for a small VPS.
- Add GitHub issue and pull request templates.
- Continue expanding Computer Science, Algorithms, and political economy content.
