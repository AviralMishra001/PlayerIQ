from sqlalchemy import String, Integer, Text, ForeignKey, Float, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    type: Mapped[str] = mapped_column(String, nullable=False)  # mcq, coding, data, communication
    text: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    correct_answer: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    difficulty: Mapped[int | None] = mapped_column(Integer, nullable=True)
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=2)


class QuestionSkill(Base):
    __tablename__ = "question_skills"

    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id", ondelete="CASCADE"), primary_key=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)
    weight: Mapped[float] = mapped_column(Float, default=1.0)
