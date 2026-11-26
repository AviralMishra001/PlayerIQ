from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict


class TaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: str
    title: str
    difficulty: Optional[int] = None
    skill_id: int


class TaskDetail(TaskOut):
    description: Optional[str] = None
    starter_code: Optional[str] = None


class SubmissionIn(BaseModel):
    submission: dict[str, Any]


class SubmissionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    task_id: int
    score: Optional[float] = None
    feedback: Optional[str] = None
    submitted_at: datetime


class EvaluationResult(BaseModel):
    score: float
    feedback: str

class TaskDetailOut(BaseModel):
    id: int
    type: str
    title: str
    description: Optional[str] = None
    difficulty: Optional[int] = None
    skill_id: int
    starter_code: Optional[str] = None
    submission_format: str