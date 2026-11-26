from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.role import Role, RoleSkill
from app.models.skill import Skill
from app.schemas.role import RoleOut, RoleDetail, RoleSkillOut

router = APIRouter(prefix="/roles", tags=["roles"])


@router.get("", response_model=list[RoleOut])
async def list_roles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Role).order_by(Role.title))
    return result.scalars().all()


@router.get("/{role_id}", response_model=RoleDetail)
async def get_role(role_id: int, db: AsyncSession = Depends(get_db)):
    role = (await db.execute(select(Role).where(Role.id == role_id))).scalar_one_or_none()
    if not role:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Role not found")

    rows = (
        await db.execute(
            select(RoleSkill, Skill)
            .join(Skill, Skill.id == RoleSkill.skill_id)
            .where(RoleSkill.role_id == role_id)
            .order_by(RoleSkill.importance.desc())
        )
    ).all()

    return RoleDetail(
        id=role.id, title=role.title, description=role.description, category=role.category,
        required_skills=[
            RoleSkillOut(skill_id=skill.id, name=skill.name, display_name=skill.display_name, importance=rs.importance)
            for rs, skill in rows
        ],
    )
