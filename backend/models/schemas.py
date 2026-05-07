from pydantic import BaseModel, Field


class TutorAskRequest(BaseModel):
    question: str | None = None
    context: str | None = None
    page_title: str | None = None
    provider: str | None = None
    model: str | None = None


class TutorAskResponse(BaseModel):
    answer: str
    cached: bool = False


class ImproveAnnotationRequest(BaseModel):
    source_text: str | None = None
    annotation: str | None = None
    model: str | None = None


class ImproveAnnotationResponse(BaseModel):
    feedback: str
    improved_annotation: str
    follow_up_question: str


class CharacterChatRequest(BaseModel):
    character: str | None = None
    scene_context: str = Field(..., min_length=1)
    route: str | None = None
    question: str = Field(..., min_length=1)
    model: str | None = None


class ArchiveSuggestion(BaseModel):
    title: str
    path: str


class CharacterChatResponse(BaseModel):
    answer: str
    suggested_archives: list[ArchiveSuggestion]
    cached: bool = False
