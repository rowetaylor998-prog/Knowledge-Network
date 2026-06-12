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

The frontend reads the backend URL from `apps/web/.env`:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
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

## Local Development Commands

You can start both development servers with:

```bash
./scripts/dev.sh
```

The script starts:

- Backend: `http://127.0.0.1:8000`
- Frontend: `http://127.0.0.1:5173`

If setup is incomplete, it prints the manual commands to run.

Manual backend:

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload
```

Manual frontend:

```bash
cd apps/web
npm run dev
```

## Build Commands

Build the frontend and check backend imports:

```bash
./scripts/build.sh
```

Manual frontend build:

```bash
cd apps/web
npm install
npm run build
```

Manual backend import check:

```bash
cd backend
source .venv/bin/activate
PYTHONPATH=. python -c "import main; print(main.app.title)"
```

## Local Checks

Run:

```bash
./scripts/check.sh
```

This checks:

- Node and npm versions.
- Python version.
- Backend health endpoint if the backend is already running.
- Whether `apps/web/dist/index.html` exists.
- Required environment example files.

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

## Basic Troubleshooting

- Frontend cannot reach backend:
  - Confirm backend is running at `http://127.0.0.1:8000`.
  - Check `apps/web/.env` has `VITE_API_BASE_URL=http://127.0.0.1:8000`.
  - Restart the Vite dev server after changing `.env`.
- Backend import or startup fails:
  - Recreate the virtual environment if needed.
  - Run `pip install -r requirements.txt` inside `backend/.venv`.
  - Start from the `backend/` directory with `uvicorn main:app --reload`.
- AI features show disabled or unavailable messages:
  - This is expected when AI is disabled or no provider key is configured.
  - Check `ENABLE_AI`, `AI_PROVIDER`, and provider-specific environment variables.
- Frontend build folder is missing:
  - Run `cd apps/web && npm run build`.
- Port already in use:
  - Stop the existing backend or frontend process, or run the service manually on another port.
