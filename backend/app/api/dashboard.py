from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.skill import Skill, UserSkillMastery
from app.models.badge import Badge, UserBadge
from app.models.role import Role, RoleSkill, UserRole
from app.schemas.dashboard import DashboardSummary, SkillRadarEntry, RoleProgress
from app.schemas.badge import BadgeOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

MASTERY_THRESHOLD = 0.7


@router.get("/summary", response_model=DashboardSummary)
async def dashboard_summary(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # --- skill_radar: average mastery per skill category ---
    mastery_rows = (
        await db.execute(
            select(UserSkillMastery, Skill.category)
            .join(Skill, Skill.id == UserSkillMastery.skill_id)
            .where(UserSkillMastery.user_id == user.id)
        )
    ).all()

    sums: dict[str, float] = {}
    counts: dict[str, int] = {}
    for mastery_row, category in mastery_rows:
        sums[category] = sums.get(category, 0.0) + mastery_row.mastery
        counts[category] = counts.get(category, 0) + 1
    skill_radar = [
        SkillRadarEntry(category=cat, mastery=round(sums[cat] / counts[cat], 3)) for cat in sums
    ]

    # --- badges ---
    badge_rows = (
        await db.execute(
            select(Badge, UserBadge.earned_at)
            .join(UserBadge, UserBadge.badge_id == Badge.id)
            .where(UserBadge.user_id == user.id)
            .order_by(UserBadge.earned_at.desc())
        )
    ).all()
    badges = [BadgeOut(name=b.name, level=b.level, earned_at=earned_at) for b, earned_at in badge_rows]

    # --- role_progress: user's most recently selected role ---
    latest_role = (
        await db.execute(
            select(Role, UserRole.role_id)
            .join(UserRole, UserRole.role_id == Role.id)
            .where(UserRole.user_id == user.id)
            .order_by(UserRole.selected_at.desc())
            .limit(1)
        )
    ).first()

    role_progress = None
    if latest_role:
        role, role_id = latest_role
        role_skills = (
            await db.execute(select(RoleSkill).where(RoleSkill.role_id == role_id))
        ).scalars().all()
        total_skills = len(role_skills)
        mastery_by_skill = {m.skill_id: m.mastery for m, _ in mastery_rows}
        skills_covered = sum(
            1 for rs in role_skills if mastery_by_skill.get(rs.skill_id, 0.0) >= MASTERY_THRESHOLD
        )
        percent = round((skills_covered / total_skills) * 100, 1) if total_skills else 0.0
        role_progress = RoleProgress(
            role_id=role_id, title=role.title, skills_covered=skills_covered,
            total_skills=total_skills, percent=percent,
        )

    return DashboardSummary(skill_radar=skill_radar, badges=badges, role_progress=role_progress)
