from datetime import datetime
from typing import Any
from pydantic import BaseModel, ConfigDict


class RoadmapCreate(BaseModel):
    role_id: int


class RoadmapOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    role_id: int
    plan_json: dict[str, Any]
    created_at: datetime
