from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.skill import Skill
from app.schemas.skill import SkillOut

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("", response_model=list[SkillOut])
async def list_skills(
    category: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Skill)
    if category:
        stmt = stmt.where(Skill.category == category)
    result = await db.execute(stmt.order_by(Skill.category, Skill.display_name))
    return result.scalars().all()
