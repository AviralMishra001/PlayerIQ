from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.skill import UserSkillMastery
from app.models.badge import Badge, UserBadge


async def update_mastery_and_check_badges(
    db: AsyncSession, user_id: int, skill_id: int, new_mastery: float, context: dict | None = None
) -> list[Badge]:
    """
    1. Upsert user_skill_mastery (keeps the higher of old/new mastery — mastery shouldn't regress
       just because a later attempt scored lower).
    2. Award any badge on this skill whose threshold_mastery <= new_mastery and not already earned.
    Returns the list of newly-earned Badge objects (empty if none).
    """
    existing_mastery = (
        await db.execute(
            select(UserSkillMastery).where(
                UserSkillMastery.user_id == user_id, UserSkillMastery.skill_id == skill_id
            )
        )
    ).scalar_one_or_none()

    effective_mastery = new_mastery
    if existing_mastery:
        effective_mastery = max(existing_mastery.mastery, new_mastery)
        existing_mastery.mastery = effective_mastery
        existing_mastery.last_practiced_at = datetime.now(timezone.utc)
    else:
        db.add(UserSkillMastery(
            user_id=user_id, skill_id=skill_id, mastery=effective_mastery,
            last_practiced_at=datetime.now(timezone.utc),
        ))

    candidate_badges = (
        await db.execute(
            select(Badge).where(Badge.skill_id == skill_id, Badge.threshold_mastery <= effective_mastery)
        )
    ).scalars().all()

    newly_earned: list[Badge] = []
    if candidate_badges:
        already_earned_ids = {
            row[0] for row in (
                await db.execute(
                    select(UserBadge.badge_id).where(
                        UserBadge.user_id == user_id,
                        UserBadge.badge_id.in_([b.id for b in candidate_badges]),
                    )
                )
            ).all()
        }
        for badge in candidate_badges:
            if badge.id in already_earned_ids:
                continue
            db.add(UserBadge(user_id=user_id, badge_id=badge.id, context=context))
            newly_earned.append(badge)

    return newly_earned
