# Contributing

Welcome. This project is still an early MVP, so the contribution process should stay friendly, practical, and light. The best contributions are clear, useful, accurate, and easy for another person to review.

## Contribution Values

- Share knowledge generously.
- Prefer clarity over cleverness.
- Check accuracy before publishing.
- Collaborate openly and respectfully.
- Do not spam.
- Do not add addictive, pay-to-win, sexualized, or exploitative content.

## How To Contribute Content

Most learning content lives under `content/`. Add or improve Markdown files when you want to explain a concept, organize a learning path, fix unclear writing, or connect related topics.

Good starter areas:

- `content/knowledge/computer-science/`
- `content/knowledge/computer-science/algorithms/`
- `content/knowledge/marxism-political-economy/`
- `content/methods-and-lessons/`
- `content/works/archive-of-sparks/`

Example:

- `content/knowledge/computer-science/example.md`

## How To Write Markdown Content

Use a simple structure:

```markdown
# Page Title

One short paragraph explaining what this page is for.

## Why This Matters

Explain the value for learners.

## Core Ideas

- First idea.
- Second idea.
- Third idea.

## Examples

Add small examples when useful.

## Questions For Study

- What should a learner think about next?

## Sources And Notes

- Add sources, references, or reasoning notes.
```

Content should:

- Start with one `#` heading.
- Include a short opening paragraph.
- Use clear section headings.
- Link to related pages when helpful.
- Mark TODOs honestly when a page is unfinished.
- Cite sources for factual, historical, technical, or political-economic claims.

## How To Contribute Code

Frontend code lives in `apps/web/`. Backend code lives in `backend/`.

Before opening a pull request, run the checks that match your change when possible:

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

Keep code changes small. Avoid rewriting unrelated parts of the project.

## How To Contribute Archive Of Sparks Scenes

Archive of Sparks content lives under `content/works/archive-of-sparks/`.

Scene data can live under:

- `content/works/archive-of-sparks/scenes/`

Example:

- `content/works/archive-of-sparks/scenes/example-scene.json`

A good scene contribution should include:

- Scene title and chapter.
- Playable identity or character.
- Setting.
- Scene beats.
- Player choices.
- Knowledge links.
- TODOs for unfinished story work.

Keep scenes lightweight. MVP scenes should be readable web interactive narratives, not full 3D games.

## How To Submit Corrections

Corrections are very welcome. You can:

- Open an issue with the correction.
- Submit a pull request that fixes the file directly.
- Add a source or reasoning note if the correction involves factual claims.

Please include:

- What is wrong or unclear.
- Where it appears.
- What you suggest changing.
- Sources or reasoning when relevant.

## How To Open An Issue

Open an issue for:

- Incorrect or unclear content.
- Broken links or broken routes.
- Missing sources.
- Frontend bugs.
- Backend API problems.
- Archive of Sparks scene ideas.
- Deployment or setup problems.

A helpful issue has:

- A clear title.
- A short description.
- Steps to reproduce, if it is a bug.
- Screenshots or links, if useful.
- A suggested fix, if you have one.

## How To Create A Branch

Use a short branch name that describes the work:

```bash
git checkout -b content/algorithms-intro
git checkout -b fix/markdown-route
git checkout -b docs/contribution-guide
git checkout -b scene/archive-chapter-0
```

## How To Submit A Pull Request

1. Create a branch.
2. Make focused changes.
3. Run relevant checks if possible.
4. Commit with a clear message.
5. Open a pull request.
6. Explain what changed and why.
7. Mention any unfinished TODOs or review questions.

Pull requests do not need to be perfect. They do need to be understandable.

## Commit Message Examples

```text
docs: add contribution workflow
content: improve algorithms introduction
scene: add delivery worker choice outline
frontend: load dynamic content index
backend: add content index endpoint
fix: correct broken archive link
```

## Content Quality Rules

- Be clear enough for a learner to follow.
- Separate facts, interpretation, and opinion.
- Check claims before presenting them as true.
- Add citations or source notes for important claims.
- Prefer concrete examples over vague statements.
- Do not add filler just to make a page longer.
- Do not copy large copyrighted text into the repository.
- Keep political, technical, and historical content serious and reviewable.
- Use TODO markers for unfinished sections.

## AI-Generated Content Policy

AI tools can help draft, outline, translate, summarize, or revise content. Human review is required before merging.

If you use AI:

- Check sources and reasoning.
- Verify factual claims.
- Rewrite unclear or generic text.
- Remove hallucinated citations or unsupported claims.
- Make sure the final content reflects the project’s goals and values.

AI output is a draft assistant, not an authority.
