"""
Rule-based roadmap generation. LLM-based version (generate_roadmap_llm) plugs in
later behind the same call site without changing the API contract.
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.role import RoleSkill
from app.models.skill import Skill, UserSkillMastery
from app.services.skill_graph_service import get_prereq_depth

MASTERY_THRESHOLD = 0.7  # a skill counts as "covered" above this
WEEKS = 4


async def generate_roadmap_rule_based(db: AsyncSession, user_id: int, role_id: int) -> dict:
    # 1. Fetch role skills + importance.
    role_skills = (
        await db.execute(select(RoleSkill).where(RoleSkill.role_id == role_id))
    ).scalars().all()
    if not role_skills:
        return {"weeks": [], "note": "Role has no configured skills yet."}

    skill_ids = [rs.skill_id for rs in role_skills]
    skills_by_id = {
        s.id: s for s in (await db.execute(select(Skill).where(Skill.id.in_(skill_ids)))).scalars().all()
    }

    # 2. Fetch user mastery for those skills.
    mastery_rows = (
        await db.execute(
            select(UserSkillMastery).where(
                UserSkillMastery.user_id == user_id, UserSkillMastery.skill_id.in_(skill_ids)
            )
        )
    ).scalars().all()
    mastery_by_skill = {m.skill_id: m.mastery for m in mastery_rows}

    # 3. Filter to missing skills, sort by importance desc + prereq depth asc (foundational first).
    missing = [rs for rs in role_skills if mastery_by_skill.get(rs.skill_id, 0.0) < MASTERY_THRESHOLD]
    depth_by_skill = {rs.skill_id: await get_prereq_depth(db, rs.skill_id) for rs in missing}
    missing.sort(key=lambda rs: (-rs.importance, depth_by_skill.get(rs.skill_id, 0)))

    # 4. Bucket into a 4-week plan, spreading skills evenly.
    weeks: list[dict] = [{"week": i + 1, "skills": [], "tasks": [], "notes": ""} for i in range(WEEKS)]
    for idx, rs in enumerate(missing):
        skill = skills_by_id.get(rs.skill_id)
        if not skill:
            continue
        week = weeks[idx % WEEKS]
        week["skills"].append({
            "skill_id": skill.id,
            "name": skill.name,
            "display_name": skill.display_name,
            "importance": rs.importance,
            "current_mastery": round(mastery_by_skill.get(rs.skill_id, 0.0), 3),
        })
        week["tasks"].append(f"Complete practice tasks for '{skill.display_name}'")

    for week in weeks:
        if not week["skills"]:
            week["notes"] = "No new skills scheduled — review and reinforce prior weeks."
        else:
            names = ", ".join(s["display_name"] for s in week["skills"])
            week["notes"] = f"Focus: {names}"

    covered = len(role_skills) - len(missing)
    return {
        "weeks": weeks,
        "total_role_skills": len(role_skills),
        "skills_covered": covered,
        "skills_missing": len(missing),
    }


async def generate_roadmap_llm(db: AsyncSession, user_id: int, role_id: int, llm_client) -> dict:
    """
    Placeholder for future LLM-personalized roadmap generation.
    Should call generate_roadmap_rule_based() first for a structured baseline,
    then ask the LLM to refine pacing/notes, keeping the same plan_json shape.
    """
    raise NotImplementedError("LLM-based roadmap generation not yet implemented.")
