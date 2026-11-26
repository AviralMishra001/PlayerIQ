from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.skill import Skill
from app.models.question import Question
from app.models.diagnostic import DiagnosticSession, DiagnosticResponse
from app.schemas.diagnostic import (
    SessionOut, SessionDetail, ResponseIn, ResponseOut, CompleteSessionOut, SkillMasteryEntry,
)
from app.services.diagnostic_service import grade_response, compute_skill_mastery
from app.services.badge_service import update_mastery_and_check_badges
from app.services.diagnostic_service import get_or_assign_session_questions
from app.schemas.diagnostic import DiagnosticQuestionsOut, DiagnosticQuestionOut, DiagnosticOptionOut


router = APIRouter(prefix="/diagnostic", tags=["diagnostic"])


async def _get_owned_session(session_id: int, user: User, db: AsyncSession) -> DiagnosticSession:
    session = (
        await db.execute(select(DiagnosticSession).where(DiagnosticSession.id == session_id))
    ).scalar_one_or_none()
    if not session:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Session not found")
    if session.user_id != user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not your session")
    return session


@router.post("/sessions", response_model=SessionOut, status_code=status.HTTP_201_CREATED)
async def create_session(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    session = DiagnosticSession(user_id=user.id)
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


@router.get("/sessions/{session_id}", response_model=SessionDetail)
async def get_session(session_id: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    session = await _get_owned_session(session_id, user, db)
    responses = (
        await db.execute(select(DiagnosticResponse).where(DiagnosticResponse.session_id == session_id))
    ).scalars().all()
    return SessionDetail(
        id=session.id, user_id=session.user_id, started_at=session.started_at,
        completed_at=session.completed_at, status=session.status,
        responses=[ResponseOut.model_validate(r) for r in responses],
    )

@router.get("/sessions/{session_id}/questions", response_model=DiagnosticQuestionsOut)
async def get_session_questions(session_id: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await _get_owned_session(session_id, user, db)  # raises 404/403 as needed
    question_ids = await get_or_assign_session_questions(db, session_id)
    if not question_ids:
        return DiagnosticQuestionsOut(session_id=session_id, total_questions=0, questions=[])

    rows = (await db.execute(select(Question).where(Question.id.in_(question_ids)))).scalars().all()
    by_id = {q.id: q for q in rows}
    ordered = [by_id[qid] for qid in question_ids if qid in by_id]

    out = []
    for q in ordered:
        options_out = None
        if q.options and "choices" in q.options:
            letters = "ABCDEFGH"
            options_out = [DiagnosticOptionOut(id=letters[i], text=c) for i, c in enumerate(q.options["choices"])]
        out.append(DiagnosticQuestionOut(id=q.id, type=q.type, text=q.text, options=options_out,
                                          difficulty=q.difficulty, estimated_minutes=q.estimated_minutes))
    return DiagnosticQuestionsOut(session_id=session_id, total_questions=len(out), questions=out)


@router.post("/sessions/{session_id}/responses", response_model=ResponseOut, status_code=status.HTTP_201_CREATED)
async def submit_response(
    session_id: int,
    payload: ResponseIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    session = await _get_owned_session(session_id, user, db)
    if session.status != "in_progress":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Session already completed")

    question = (
        await db.execute(select(Question).where(Question.id == payload.question_id))
    ).scalar_one_or_none()
    if not question:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Question not found")

    is_correct, score = grade_response(question, payload.answer)
    response = DiagnosticResponse(
        session_id=session_id,
        question_id=payload.question_id,
        answer=payload.answer,
        is_correct=is_correct,
        score=score,
        time_taken_sec=payload.time_taken_sec,
    )
    db.add(response)
    await db.commit()
    await db.refresh(response)
    return response


@router.post("/sessions/{session_id}/complete", response_model=CompleteSessionOut)
async def complete_session(
    session_id: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    session = await _get_owned_session(session_id, user, db)
    if session.status == "completed":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Session already completed")

    mastery_by_skill = await compute_skill_mastery(db, session_id)

    for skill_id, mastery in mastery_by_skill.items():
        await update_mastery_and_check_badges(
            db, user_id=user.id, skill_id=skill_id, new_mastery=mastery,
            context={"source": "diagnostic", "session_id": session_id},
        )

    session.status = "completed"
    session.completed_at = datetime.now(timezone.utc)
    await db.commit()

    skill_ids = list(mastery_by_skill.keys())
    skills = (await db.execute(select(Skill).where(Skill.id.in_(skill_ids)))).scalars().all() if skill_ids else []
    skill_name_by_id = {s.id: s.name for s in skills}

    return CompleteSessionOut(
        session=SessionOut.model_validate(session),
        skill_mastery=[
            SkillMasteryEntry(skill_id=sid, name=skill_name_by_id.get(sid, "unknown"), mastery=round(m, 4))
            for sid, m in mastery_by_skill.items()
        ],
    )
