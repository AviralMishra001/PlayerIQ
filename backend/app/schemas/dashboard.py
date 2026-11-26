from typing import Optional
from pydantic import BaseModel
from app.schemas.badge import BadgeOut


class SkillRadarEntry(BaseModel):
    category: str
    mastery: float


class RoleProgress(BaseModel):
    role_id: int
    title: str
    skills_covered: int
    total_skills: int
    percent: float


class DashboardSummary(BaseModel):
    skill_radar: list[SkillRadarEntry]
    badges: list[BadgeOut]
    role_progress: Optional[RoleProgress] = None
