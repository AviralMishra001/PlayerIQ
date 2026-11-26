from typing import Optional
from pydantic import BaseModel, ConfigDict


class SkillOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    display_name: str
    category: str
    description: Optional[str] = None


class SkillCreate(BaseModel):
    name: str
    display_name: str
    category: str
    description: Optional[str] = None
    prerequisite_ids: list[int] = []
