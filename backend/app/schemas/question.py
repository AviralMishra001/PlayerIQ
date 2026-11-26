from typing import Optional, Any
from pydantic import BaseModel, ConfigDict, Field


class QuestionSkillTag(BaseModel):
    skill_id: int
    weight: float = 1.0


class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: str
    text: str
    options: Optional[dict[str, Any]] = None
    difficulty: Optional[int] = None
    estimated_minutes: int


# Separate "safe" schema hides correct_answer from clients taking the diagnostic
class QuestionPublic(QuestionOut):
    pass


class QuestionCreate(BaseModel):
    type: str
    text: str
    options: Optional[dict[str, Any]] = None
    correct_answer: Optional[dict[str, Any]] = None
    difficulty: Optional[int] = Field(default=None, ge=1, le=5)
    estimated_minutes: int = 2
    skills: list[QuestionSkillTag] = []
