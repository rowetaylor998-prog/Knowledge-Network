from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import content, story, tutor

load_dotenv()


app = FastAPI(
    title="Be Knowledgeable API",
    description="Minimal backend skeleton for the open knowledge platform MVP.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tutor.router, prefix="/api/tutor", tags=["tutor"])
app.include_router(story.router, prefix="/api/story", tags=["story"])
app.include_router(content.router, prefix="/api/content", tags=["content"])


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
