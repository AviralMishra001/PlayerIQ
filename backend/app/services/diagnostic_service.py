"""
Diagnostic service.
- grade_response(): scores a single submitted answer against a question.
- compute_skill_mastery(): aggregates all responses in a session into per-skill mastery.
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.question import Question, QuestionSkill
from app.models.diagnostic import DiagnosticResponse
from app.models.diagnostic import DiagnosticSessionQuestion

DEFAULT_QUESTION_LIMIT = 12

def grade_response(question: Question, answer: dict) -> tuple[bool, float]:
    """
    Returns (is_correct, score). MCQ: exact match on 'index'. Non-MCQ types
    (coding/data/communication) are not auto-graded here -> scored via task_evaluator later,
    so default to score=0.0/None until evaluated.
    """
    if question.type == "mcq":
        correct = question.correct_answer or {}
        is_correct = answer.get("index") == correct.get("index")
        return is_correct, 1.0 if is_correct else 0.0
    # Other types: no auto-grading at diagnostic stage.
    return False, 0.0


async def compute_skill_mastery(db: AsyncSession, session_id: int) -> dict[int, float]:
    """
    mastery_s = sum(score_q * weight_q,s) / sum(weight_q,s)
    for every skill tagged on questions answered in this session.
    """
    responses = (
        await db.execute(select(DiagnosticResponse).where(DiagnosticResponse.session_id == session_id))
    ).scalars().all()
    if not responses:
        return {}

    question_ids = [r.question_id for r in responses]
    score_by_question = {r.question_id: (r.score or 0.0) for r in responses}

    tags = (
        await db.execute(select(QuestionSkill).where(QuestionSkill.question_id.in_(question_ids)))
    ).scalars().all()

    weighted_sum: dict[int, float] = {}
    weight_sum: dict[int, float] = {}
    for tag in tags:
        q_score = score_by_question.get(tag.question_id, 0.0)
        weighted_sum[tag.skill_id] = weighted_sum.get(tag.skill_id, 0.0) + q_score * tag.weight
        weight_sum[tag.skill_id] = weight_sum.get(tag.skill_id, 0.0) + tag.weight

    return {
        skill_id: (weighted_sum[skill_id] / weight_sum[skill_id])
        for skill_id in weighted_sum
        if weight_sum[skill_id] > 0
    }

async def get_or_assign_session_questions(db: AsyncSession, session_id: int, limit: int = DEFAULT_QUESTION_LIMIT) -> list[int]:
    existing = (
        await db.execute(
            select(DiagnosticSessionQuestion.question_id)
            .where(DiagnosticSessionQuestion.session_id == session_id)
            .order_by(DiagnosticSessionQuestion.position)
        )
    ).scalars().all()
    if existing:
        return list(existing)

    all_ids = (
    await db.execute(
        select(Question.id).order_by(Question.difficulty, Question.id)
    )
).scalars().all()
    selected = all_ids[:limit]
    for pos, qid in enumerate(selected, start=1):
        db.add(DiagnosticSessionQuestion(session_id=session_id, question_id=qid, position=pos))
    await db.commit()
    return selected