from app.core.database import Base  # noqa
from app.models.user import User  # noqa
from app.models.skill import Skill, SkillPrerequisite, UserSkillMastery  # noqa
from app.models.question import Question, QuestionSkill  # noqa
from app.models.diagnostic import DiagnosticSession, DiagnosticResponse  # noqa
from app.models.role import Role, RoleSkill, UserRole  # noqa
from app.models.roadmap import Roadmap  # noqa
from app.models.task import Task, TaskSubmission  # noqa
from app.models.badge import Badge, UserBadge  # noqa
from app.models.diagnostic import DiagnosticSession, DiagnosticResponse, DiagnosticSessionQuestion  # noqa
# add "DiagnosticSessionQuestion" to __all__ list

__all__ = [
    "Base", "User", "Skill", "SkillPrerequisite", "UserSkillMastery",
    "Question", "QuestionSkill", "DiagnosticSession", "DiagnosticResponse",
    "Role", "RoleSkill", "UserRole", "Roadmap", "Task", "TaskSubmission",
    "Badge", "UserBadge","DiagnosticSessionQuestion",
]
