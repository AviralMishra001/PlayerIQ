"""
Seed roles + role_skills. Requires seed_skills.py to have run first.
Run: python -m scripts.seed_roles
"""
import asyncio
from app.core.database import AsyncSessionLocal
from app.models.role import Role, RoleSkill
from app.models.skill import Skill
from sqlalchemy import select

# title, description, category, min_skills_count
ROLES = [
    ("Junior Data Analyst", "Entry-level role analyzing data to support business decisions.", "data", 12),
    ("Frontend Developer", "Builds user-facing web interfaces.", "programming", 12),
    ("Backend Developer", "Builds server-side logic, APIs, and databases.", "programming", 12),
    ("Digital Marketing Executive", "Runs marketing campaigns and analyzes performance.", "marketing", 10),
    ("QA / Test Engineer", "Tests software for bugs and quality issues.", "programming", 10),
    ("Business Development Associate", "Handles outreach, pitching, and client relationships.", "communication", 10),
]

# role_title -> [(skill_name, importance), ...]
ROLE_SKILLS = {
    "Junior Data Analyst": [
        ("sql_basics", 1.0), ("sql_joins", 0.9), ("excel_basics", 0.9), ("csv_basics", 0.8),
        ("data_cleaning", 1.0), ("basic_stats", 1.0), ("visualization", 0.9), ("pandas_basics", 0.8),
        ("data_aggregation", 0.8), ("dashboarding", 0.7), ("data_storytelling", 0.7), ("hypothesis_testing", 0.6),
    ],
    "Frontend Developer": [
        ("html_css", 1.0), ("javascript_basics", 1.0), ("react_basics", 1.0), ("git_basics", 0.8),
        ("debugging", 0.8), ("http_fundamentals", 0.7), ("rest_apis", 0.7), ("functions", 0.6),
        ("control_flow", 0.6), ("arrays", 0.6), ("time_complexity", 0.4), ("unit_testing", 0.5),
    ],
    "Backend Developer": [
        ("python_basics", 0.9), ("functions", 0.8), ("oops", 0.9), ("sql_basics", 1.0), ("sql_joins", 0.9),
        ("rest_apis", 1.0), ("http_fundamentals", 0.8), ("api_authentication", 0.9), ("git_basics", 0.7),
        ("data_structures_stack_queue", 0.6), ("hashing", 0.6), ("unit_testing", 0.7), ("debugging", 0.7),
    ],
    "Digital Marketing Executive": [
        ("data_storytelling", 0.8), ("visualization", 0.6), ("basic_stats", 0.5), ("excel_basics", 0.7),
        ("email_writing", 0.9), ("public_speaking", 0.6), ("pitch_communication", 0.8),
        ("linkedin_branding", 0.7), ("technical_writing", 0.5), ("teamwork", 0.6),
    ],
    "QA / Test Engineer": [
        ("unit_testing", 1.0), ("debugging", 1.0), ("control_flow", 0.7), ("functions", 0.7),
        ("http_fundamentals", 0.6), ("rest_apis", 0.6), ("git_basics", 0.6), ("technical_writing", 0.7),
        ("time_complexity", 0.4), ("teamwork", 0.5),
    ],
    "Business Development Associate": [
        ("email_writing", 0.9), ("cold_outreach", 1.0), ("pitch_communication", 1.0),
        ("negotiation_basics", 0.9), ("active_listening", 0.7), ("public_speaking", 0.7),
        ("linkedin_branding", 0.8), ("teamwork", 0.6), ("feedback_giving", 0.5), ("interview_basics", 0.4),
    ],
}


async def seed():
    async with AsyncSessionLocal() as db:
        skills = (await db.execute(select(Skill))).scalars().all()
        skill_name_to_id = {s.name: s.id for s in skills}

        title_to_id: dict[str, int] = {}
        for title, description, category, min_skills in ROLES:
            existing = (await db.execute(select(Role).where(Role.title == title))).scalar_one_or_none()
            if existing:
                title_to_id[title] = existing.id
                continue
            role = Role(title=title, description=description, category=category, min_skills_count=min_skills)
            db.add(role)
            await db.flush()
            title_to_id[title] = role.id
        await db.commit()
        print(f"Seeded {len(ROLES)} roles.")

        link_count = 0
        for title, skill_list in ROLE_SKILLS.items():
            role_id = title_to_id.get(title)
            if not role_id:
                continue
            for skill_name, importance in skill_list:
                skill_id = skill_name_to_id.get(skill_name)
                if not skill_id:
                    print(f"Skipping unknown skill '{skill_name}' for role '{title}'")
                    continue
                existing = (
                    await db.execute(
                        select(RoleSkill).where(RoleSkill.role_id == role_id, RoleSkill.skill_id == skill_id)
                    )
                ).scalar_one_or_none()
                if existing:
                    continue
                db.add(RoleSkill(role_id=role_id, skill_id=skill_id, importance=importance))
                link_count += 1
        await db.commit()
        print(f"Seeded {link_count} role_skill links.")


if __name__ == "__main__":
    asyncio.run(seed())
