# Contribution System

This document describes the lightweight contribution system for early MVP collaborators. The goal is to help friends and early contributors participate without turning the project into a bureaucracy.

## Who Can Contribute

Contributors can help with:

- Knowledge content.
- Frontend code.
- Backend code.
- Archive of Sparks scenes.
- Documentation.
- Corrections and review.
- Deployment notes and testing.

## Contribution Values

- Knowledge sharing: contributions should help people understand something better.
- Clarity: write so another learner or contributor can follow the idea.
- Accuracy: check facts, sources, and reasoning.
- Open collaboration: explain decisions and welcome review.
- No spam: do not add promotional filler or low-effort content.
- No addictive/pay-to-win/sexualized content: the platform should stay educational and humane.

## Content Contributions

Content usually belongs under `content/`.

Good content contributions include:

- New Markdown pages.
- Clearer explanations.
- Better topic structure.
- More examples.
- Corrections.
- Source notes.
- Links between related pages.

Use this example as a starting point:

- `content/knowledge/computer-science/example.md`

## Code Contributions

Frontend work lives in:

- `apps/web/`

Backend work lives in:

- `backend/`

Code contributions should be small and focused. Prefer improving the current MVP over large rewrites.

Useful checks:

```bash
cd apps/web
npm install
npm run build
```

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
curl http://127.0.0.1:8000/health
```

## Archive Of Sparks Scene Contributions

Archive scenes live under:

- `content/works/archive-of-sparks/`

Scene JSON files can live under:

- `content/works/archive-of-sparks/scenes/`

Use this example as a starting point:

- `content/works/archive-of-sparks/scenes/example-scene.json`

Scene contributions should define:

- Chapter.
- Playable identity.
- Setting.
- Characters.
- Scene beats.
- Choices.
- Knowledge links.
- TODOs.

Keep scenes lightweight. MVP 0.3 should improve reusable chapter structure, not become a full 3D game.

## Corrections

Corrections can be submitted as issues or pull requests.

Good corrections explain:

- The file or page with the problem.
- The incorrect or unclear part.
- The suggested replacement.
- Sources or reasoning if the correction is factual.

Small corrections are valuable. Do not wait until you can fix everything.

## Issues

Open an issue when:

- A page is wrong or unclear.
- A link is broken.
- A route does not load.
- A source is missing.
- A scene idea needs discussion.
- A setup or deployment step fails.

Issue format:

```markdown
## Problem

What is wrong or missing?

## Where

Link or file path.

## Suggested Fix

What should change?
```

## Branches

Use short branch names:

```bash
git checkout -b content/computer-science-example
git checkout -b docs/contribution-system
git checkout -b scene/example-scene
git checkout -b fix/broken-content-link
```

## Pull Requests

A pull request should answer:

- What changed?
- Why does it help?
- How can it be tested or reviewed?
- Is anything unfinished?

Simple PR description:

```markdown
## Summary

- Added an algorithms content example.

## Review Notes

- Please check clarity and structure.

## Testing

- Read the Markdown page locally.
```

## Commit Messages

Examples:

```text
docs: improve contribution guide
content: add computer science example page
scene: add archive scene example
fix: correct markdown link
frontend: improve knowledge content cards
backend: clarify content API error
```

## Markdown Content Rules

- Start with a `#` title.
- Add one short opening paragraph.
- Use `##` headings for sections.
- Keep paragraphs readable.
- Use bullet lists for maps, steps, and examples.
- Link related pages when useful.
- Add source notes for factual claims.
- Mark uncertain or unfinished parts with TODOs.

## AI-Generated Content Policy

AI can help draft content, but human review is required.

Before merging AI-assisted content:

- Check the sources.
- Check the reasoning.
- Verify factual claims.
- Remove unsupported claims.
- Edit generic prose into clear project-specific writing.
- Make sure the content follows project values.

AI can help us move faster, but it does not replace contributor judgment.

## Lightweight Review Expectations

- Content review checks clarity, accuracy, structure, and sources.
- Code review checks behavior, simplicity, and whether the change fits the MVP.
- Scene review checks narrative clarity, educational value, and suitability.
- Documentation review checks whether a new contributor can follow it.

The early project needs momentum and care. Reviews should help people improve their contributions, not scare them away.
