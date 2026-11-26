from fastapi import APIRouter
from app.api import auth, users, skills, diagnostic, roles, roadmaps, tasks, badges, dashboard

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(skills.router)
api_router.include_router(diagnostic.router)
api_router.include_router(roles.router)
api_router.include_router(roadmaps.router)
api_router.include_router(tasks.router)
api_router.include_router(badges.router)
api_router.include_router(dashboard.router)
