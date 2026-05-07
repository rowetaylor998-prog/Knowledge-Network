# Be Knowledgeable. Be Free. Be Independent. Be Capable.

An open-source knowledge platform for methods, lessons, natural science, social science, and guided learning works.

The project begins with Markdown-based knowledge content, a lightweight React/Vite frontend, a minimal FastAPI backend, and a path toward AI tutor support that is not locked to one AI company.

## MVP Scope

- Homepage manifesto.
- Methods & Lessons.
- Knowledge section.
- Computer Science starter content.
- Marxism / Political Economy starter content.
- Archive of Sparks Chapter 0 prototype.
- Optional AI tutor backend skeleton.

## Run Frontend

```bash
cd apps/web
npm install
npm run dev
```

## Run Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

By default, the backend can run with AI disabled:

```bash
AI_PROVIDER=disabled
```

Hosted or external AI providers should be called from the backend, not directly from the browser, so API keys are not exposed.

## AI Provider Switching

The backend uses a provider abstraction in `backend/services/ai/`. Routes call `provider_factory.get_ai_provider()` instead of calling OpenAI directly.

For local development without AI calls:

```bash
ENABLE_AI=true
AI_PROVIDER=disabled
```

To use OpenAI:

```bash
ENABLE_AI=true
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.4-mini
```

Future providers can be added behind the same `AIProvider.generate()` interface, including Ollama, local open-source models, and community model nodes. This prevents vendor lock-in because frontend and route code do not depend on one company's SDK or response format.

## Contribution Workflow

1. Fork the repository or create a branch.
2. Edit content or code.
3. Commit your changes.
4. Open a pull request.

## Repository Map

- `docs/`: vision, governance, and architecture notes.
- `content/`: Markdown knowledge content and guided learning works.
- `apps/web/`: React/Vite frontend MVP.
- `backend/`: FastAPI backend skeleton and AI provider abstraction.
- `ai-lab/`: future local, open-source, and decentralized AI experiments.
- `scripts/`: future project automation scripts.
- `docker/`: future container and deployment files.

## Content Structure

The `content/` folder is the Git-backed knowledge base. It starts with:

- `content/methods-and-lessons/`: learning methods, experience lessons, and collaboration notes.
- `content/knowledge/computer-science/`: computer science starter content, including algorithms.
- `content/knowledge/marxism-political-economy/`: Marxism, political economy, and scientific socialism starter content.
- `content/works/archive-of-sparks/`: guided learning narrative content for Archive of Sparks.

Markdown pages should stay small at first: title, short description, placeholder sections, TODO markers, and links to related pages.
