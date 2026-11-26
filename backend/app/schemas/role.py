from typing import Optional
from pydantic import BaseModel, ConfigDict


class RoleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    category: Optional[str] = None


class RoleSkillOut(BaseModel):
    skill_id: int
    name: str
    display_name: str
    importance: float


class RoleDetail(RoleOut):
    required_skills: list[RoleSkillOut] = []
