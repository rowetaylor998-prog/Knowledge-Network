# MVP Deployment Readiness Checklist

This checklist is for validating the Be Knowledgeable Platform MVP before a local demo, staging deploy, or small VPS deployment.

## 1. Local Development Check

- Backend health endpoint responds successfully.
- Frontend dev server starts successfully.
- Frontend can reach the backend through `VITE_API_BASE_URL`.
- AI disabled mode behaves cleanly:
  - `ENABLE_AI=false`
  - AI tutor, annotation improvement, and Atang chat show a disabled or unavailable message without crashing.
- AI external/OpenAI mode behaves cleanly:
  - `ENABLE_AI=true`
  - `AI_PROVIDER=openai` or external provider configuration is valid.
  - Missing or invalid API keys fail with clear backend messages.
- Browser console has no critical runtime errors during normal navigation.
- Backend logs show no unexpected tracebacks during homepage, Markdown, tutor, annotation, and Archive of Sparks flows.

## 2. Frontend Build Check

Run:

```bash
cd apps/web
npm install
npm run build
```

Expected result:

- TypeScript check passes.
- Vite production build completes.
- `dist/` output is generated.
- No hardcoded local-only backend URL remains in production-facing code unless it is the intended fallback.

## 3. Backend Check

Run:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

In another terminal:

```bash
curl http://127.0.0.1:8000/health
```

Expected result:

- Backend starts without import errors.
- `/health` returns a successful response.
- Content Markdown endpoint works.
- Content index endpoint works if enabled in this MVP build.
- AI endpoints return either useful AI output or a clean disabled/error message.

## 4. Environment Variables

Backend:

- `ENABLE_AI`
- `AI_PROVIDER`
- `OPENAI_API_KEY`
- `EXTERNAL_AI_BASE_URL`
- `AI_DAILY_LIMIT`
- `AI_CACHE_ENABLED`

Frontend:

- `VITE_API_BASE_URL`

Recommended local frontend example:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Recommended local backend AI-disabled example:

```bash
ENABLE_AI=false
AI_CACHE_ENABLED=true
AI_DAILY_LIMIT=50
```

Recommended local backend OpenAI example:

```bash
ENABLE_AI=true
AI_PROVIDER=openai
OPENAI_API_KEY=your_api_key_here
AI_CACHE_ENABLED=true
AI_DAILY_LIMIT=50
```

## 5. MVP Manual Test List

- Homepage opens.
- Manifesto opens.
- Methods page opens.
- Knowledge page opens.
- Algorithms legacy page opens.
- Markdown content loads.
- Annotation localStorage works.
- AI tutor works or disabled message appears.
- Archive of Sparks scene works.
- Ask Atang works or disabled message appears.
- Browser refresh keeps the expected route.
- Direct navigation to important frontend routes works through the deployed server fallback.

## 6. Deployment Notes for Small VPS

- Use a process manager such as `systemd`, `supervisord`, or PM2 to keep backend and frontend services alive.
- Serve the frontend production build with Nginx, Caddy, or another static file server.
- Configure frontend history fallback so routes such as `/manifesto`, `/knowledge`, and `/works/archive-of-sparks` return `index.html`.
- Put the backend behind a reverse proxy.
- Enable HTTPS before sharing the MVP publicly.
- Set `VITE_API_BASE_URL` to the public backend URL during frontend build.
- Keep backend secrets out of the repository and shell history.
- Use conservative AI limits for demos to avoid unexpected cost.
- Confirm CORS settings allow the deployed frontend origin.
- Keep logs accessible for backend failures and AI provider errors.

## 7. Known Limitations

- MVP persistence may rely on browser localStorage for some frontend features.
- AI behavior depends on provider availability, keys, rate limits, and configured daily limits.
- Markdown content structure may still include legacy routes and transitional paths.
- Search, permissions, user accounts, and durable annotation storage may not be production-ready.
- Small VPS deployments may need swap space or stricter process limits if builds run on the server.
- The Archive of Sparks scene is a lightweight interactive narrative, not a full game engine.

## 8. Next Improvements

- Add automated smoke tests for core frontend routes.
- Add backend tests for health, Markdown content, content index, and AI-disabled behavior.
- Add deployment-specific `.env.example` files for frontend and backend.
- Add persistent annotation storage in the backend.
- Add content metadata or frontmatter for richer dynamic indexes.
- Add structured monitoring for backend errors and AI usage.
- Add a staging deployment before public launch.
- Document backup and restore steps for any future database or uploaded content.
