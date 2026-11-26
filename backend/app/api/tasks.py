from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.task import Task, TaskSubmission
from app.schemas.task import TaskOut, SubmissionIn, SubmissionOut
from app.services.task_evaluator import evaluate_task_submission
from app.services.badge_service import update_mastery_and_check_badges
from app.schemas.task import TaskDetailOut

_SUBMISSION_FORMAT = {"coding": "code", "data": "file_or_text", "communication": "text"}

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskOut])
async def list_tasks(
    skill_id: Optional[int] = Query(default=None),
    difficulty: Optional[int] = Query(default=None),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Task)
    if skill_id is not None:
        stmt = stmt.where(Task.skill_id == skill_id)
    if difficulty is not None:
        stmt = stmt.where(Task.difficulty == difficulty)
    result = await db.execute(stmt.order_by(Task.difficulty))
    return result.scalars().all()

@router.get("/{task_id}", response_model=TaskDetailOut)
async def get_task_detail(task_id: int, db: AsyncSession = Depends(get_db)):
    task = (await db.execute(select(Task).where(Task.id == task_id))).scalar_one_or_none()
    if not task:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not found")
    return TaskDetailOut(
        id=task.id, type=task.type, title=task.title, description=task.description,
        difficulty=task.difficulty, skill_id=task.skill_id, starter_code=task.starter_code,
        submission_format=_SUBMISSION_FORMAT.get(task.type, "text"),
    )

@router.post("/{task_id}/submissions", response_model=SubmissionOut, status_code=status.HTTP_201_CREATED)
async def submit_task(
    task_id: int,
    payload: SubmissionIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    task = (await db.execute(select(Task).where(Task.id == task_id))).scalar_one_or_none()
    if not task:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Task not found")

    result = evaluate_task_submission(task, payload.submission)

    submission = TaskSubmission(
        task_id=task_id, user_id=user.id, submission=payload.submission,
        score=result["score"], feedback=result["feedback"],
    )
    db.add(submission)

    await update_mastery_and_check_badges(
        db, user_id=user.id, skill_id=task.skill_id, new_mastery=result["score"],
        context={"source": "task", "task_id": task_id},
    )

    await db.commit()
    await db.refresh(submission)
    return submission


@router.get("/{task_id}/submissions/me", response_model=list[SubmissionOut])
async def my_submissions(
    task_id: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(TaskSubmission)
        .where(TaskSubmission.task_id == task_id, TaskSubmission.user_id == user.id)
        .order_by(TaskSubmission.submitted_at.desc())
    )
    return result.scalars().all()
