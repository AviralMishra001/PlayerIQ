from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.role import Role, UserRole
from app.models.roadmap import Roadmap
from app.schemas.roadmap import RoadmapCreate, RoadmapOut
from app.services.roadmap_service import generate_roadmap_rule_based

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])


@router.post("", response_model=RoadmapOut, status_code=status.HTTP_201_CREATED)
async def create_roadmap(
    payload: RoadmapCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    role = (await db.execute(select(Role).where(Role.id == payload.role_id))).scalar_one_or_none()
    if not role:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Role not found")

    plan_json = await generate_roadmap_rule_based(db, user.id, payload.role_id)

    roadmap = Roadmap(user_id=user.id, role_id=payload.role_id, plan_json=plan_json)
    db.add(roadmap)

    existing_selection = (
        await db.execute(
            select(UserRole).where(UserRole.user_id == user.id, UserRole.role_id == payload.role_id)
        )
    ).scalar_one_or_none()
    if not existing_selection:
        db.add(UserRole(user_id=user.id, role_id=payload.role_id))

    await db.commit()
    await db.refresh(roadmap)
    return roadmap


@router.get("/me", response_model=RoadmapOut)
async def get_my_latest_roadmap(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    roadmap = (
        await db.execute(
            select(Roadmap).where(Roadmap.user_id == user.id).order_by(Roadmap.created_at.desc()).limit(1)
        )
    ).scalar_one_or_none()
    if not roadmap:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No roadmap generated yet")
    return roadmap
