"""
Skill graph traversal using recursive CTEs over skill_prerequisites.
"""
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

_PREREQ_CTE = """
WITH RECURSIVE chain AS (
    SELECT prereq_skill_id AS skill_id FROM skill_prerequisites WHERE skill_id = :skill_id
    UNION
    SELECT sp.prereq_skill_id FROM skill_prerequisites sp
    JOIN chain c ON sp.skill_id = c.skill_id
)
SELECT skill_id FROM chain
"""

_DEPENDENT_CTE = """
WITH RECURSIVE chain AS (
    SELECT skill_id FROM skill_prerequisites WHERE prereq_skill_id = :skill_id
    UNION
    SELECT sp.skill_id FROM skill_prerequisites sp
    JOIN chain c ON sp.prereq_skill_id = c.skill_id
)
SELECT skill_id FROM chain
"""


async def get_prerequisite_chain(db: AsyncSession, skill_id: int) -> list[int]:
    """All prerequisite skill IDs (recursive, transitive) for a skill."""
    result = await db.execute(text(_PREREQ_CTE), {"skill_id": skill_id})
    return [row[0] for row in result.fetchall()]


async def get_dependent_skills(db: AsyncSession, skill_id: int) -> list[int]:
    """All skills that (directly or indirectly) depend on this skill."""
    result = await db.execute(text(_DEPENDENT_CTE), {"skill_id": skill_id})
    return [row[0] for row in result.fetchall()]


async def get_prereq_depth(db: AsyncSession, skill_id: int) -> int:
    """Depth of the prerequisite chain — a rough proxy for how foundational a skill is."""
    chain = await get_prerequisite_chain(db, skill_id)
    return len(chain)
