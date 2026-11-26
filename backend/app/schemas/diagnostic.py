from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict


class SessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    status: str


class ResponseIn(BaseModel):
    question_id: int
    answer: dict[str, Any]
    time_taken_sec: Optional[int] = None


class ResponseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    question_id: int
    is_correct: Optional[bool] = None
    score: Optional[float] = None


class SessionDetail(SessionOut):
    responses: list[ResponseOut] = []


class SkillMasteryEntry(BaseModel):
    skill_id: int
    name: str
    mastery: float


class CompleteSessionOut(BaseModel):
    session: SessionOut
    skill_mastery: list[SkillMasteryEntry]

class DiagnosticOptionOut(BaseModel):
    id: str
    text: str

class DiagnosticQuestionOut(BaseModel):
    id: int
    type: str
    text: str
    options: Optional[list[DiagnosticOptionOut]] = None
    difficulty: Optional[int] = None
    estimated_minutes: Optional[int] = None

class DiagnosticQuestionsOut(BaseModel):
    session_id: int
    total_questions: int
    questions: list[DiagnosticQuestionOut]