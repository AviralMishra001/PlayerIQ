from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.badge import Badge, UserBadge
from app.schemas.badge import BadgeOut

router = APIRouter(prefix="/badges", tags=["badges"])


@router.get("/me", response_model=list[BadgeOut])
async def my_badges(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = (
        await db.execute(
            select(Badge, UserBadge.earned_at)
            .join(UserBadge, UserBadge.badge_id == Badge.id)
            .where(UserBadge.user_id == user.id)
            .order_by(UserBadge.earned_at.desc())
        )
    ).all()
    return [BadgeOut(name=badge.name, level=badge.level, earned_at=earned_at) for badge, earned_at in rows]
