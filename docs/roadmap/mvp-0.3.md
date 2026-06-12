# MVP 0.3 Roadmap

MVP 0.3 is the next stage of the Be Knowledgeable Platform. It should turn the current MVP from a working prototype into a clearer collaborative knowledge and learning system, while keeping the scope small enough to deploy, test, and improve quickly.

## Current MVP 0.2 Status

- React/Vite frontend has working routes for homepage, manifesto, methods, knowledge, legacy repositories, Markdown pages, and Archive of Sparks.
- FastAPI backend provides health, Markdown content loading, content index, AI tutor, annotation improvement, and Archive of Sparks character chat endpoints.
- Markdown content lives under `content/`, with legacy knowledge trees still available under `repositories/`.
- Knowledge page can load Markdown content dynamically from the backend content index.
- Markdown pages support local browser annotations through localStorage.
- Archive of Sparks Chapter 0 exists as a lightweight interactive narrative MVP.
- AI can be disabled or connected to provider-backed services.
- Deployment readiness checklist exists for local development, frontend build, backend check, environment variables, and small VPS notes.

## MVP 0.3 Goals

1. Make the platform more collaborative.
2. Improve Computer Science and Algorithms content structure.
3. Improve Archive of Sparks Chapter 0 into a reusable chapter framework.
4. Prepare GitHub contribution workflow.
5. Prepare small VPS deployment workflow.
6. Improve content discovery and search.
7. Keep AI optional and provider-agnostic.

## Required Features

- Collaboration preparation:
  - Add clear contributor documentation for editing Markdown content.
  - Add issue and pull request templates for content, frontend, backend, and narrative work.
  - Add basic review expectations for factual content, political economy content, technical content, and narrative scenes.
- Computer Science and Algorithms structure:
  - Organize algorithms content into a clearer hierarchy.
  - Add landing pages for algorithms categories such as classical algorithms, modern algorithms, and platform algorithms.
  - Preserve legacy repository links while making the new Markdown structure easier to browse.
- Archive of Sparks chapter framework:
  - Extract reusable chapter data patterns from Chapter 0.
  - Define a simple structure for identities, scene beats, route choices, archive links, and guide character prompts.
  - Keep Chapter 0 playable without turning it into a 3D game.
- GitHub contribution workflow:
  - Document branch naming, commit expectations, review flow, and content review process.
  - Add a lightweight checklist for new content pages.
  - Add instructions for running frontend and backend checks before opening a pull request.
- Small VPS deployment workflow:
  - Convert deployment notes into a repeatable step-by-step workflow.
  - Document environment variable setup for backend and frontend.
  - Document process management, reverse proxy, HTTPS, CORS, logs, and rollback basics.
- Content discovery and search:
  - Improve the content index UI with filtering or section navigation.
  - Add a simple frontend search over indexed Markdown titles, paths, categories, and descriptions.
  - Keep search lightweight for MVP 0.3.
- AI provider independence:
  - Keep AI disabled mode fully usable.
  - Keep frontend calls routed through centralized API helpers.
  - Avoid frontend assumptions about a single AI provider.
  - Ensure provider errors surface as clear user messages.

## Nice-To-Have Features

- Frontmatter support for Markdown title, description, category, tags, and sort order.
- Content tags for algorithms, political economy, methods, Archive of Sparks, and future fields.
- A visible content index page or sidebar for Markdown navigation.
- Basic smoke tests for backend health, content index, Markdown loading, and frontend build.
- A simple script for checking broken Markdown links.
- A starter guide for writing Archive of Sparks chapters.
- Optional Atang prompt presets for different explanation routes.
- Deployment examples for Nginx or Caddy.

## Out Of Scope For MVP 0.3

- Full 3D game.
- Decentralized GPU cloud implementation.
- Large-scale open-source model hosting.
- Full committee governance backend.
- User account system unless already trivial.
- Complex database-backed annotation system.
- Real-time multiplayer collaboration.
- Large-scale search infrastructure.
- Payment, billing, roles, permissions, or moderation systems.

## Manual Testing Checklist

- Homepage opens.
- Manifesto opens.
- Methods page opens.
- Knowledge page opens.
- Dynamic content index loads.
- Content search or filtering works if implemented.
- Algorithms legacy page opens.
- Computer Science legacy page opens.
- Markdown content pages load from `/content/...` paths.
- Refreshing a `/content/...` path still renders the Markdown page.
- Annotation localStorage works after refresh.
- Annotation edit and delete work.
- AI tutor works or shows a disabled message.
- AI annotation improvement works or shows a disabled message.
- Archive of Sparks Chapter 0 opens.
- Delivery Worker / Platform Worker route remains playable.
- Each Archive of Sparks explanation route updates the selected explanation and links.
- Ask Atang works or shows a disabled message.
- Frontend build passes.
- Backend health endpoint responds.
- Small VPS deployment workflow can be followed on a clean machine or staging server.

## Expected Result

By the end of MVP 0.3, the platform should feel less like a single-person prototype and more like a small, organized collaborative project. Contributors should understand where content lives, how to improve it, how to test changes, and how to deploy the MVP. Learners should be able to browse and discover Markdown content more easily, use Archive of Sparks Chapter 0 as a reusable narrative pattern, and rely on AI features only when they are enabled and useful.
