from datetime import datetime
from pydantic import BaseModel, ConfigDict


class BadgeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    level: int
    earned_at: datetime
