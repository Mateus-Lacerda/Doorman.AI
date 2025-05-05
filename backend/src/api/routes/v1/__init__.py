from fastapi import APIRouter

from src.api.routes.v1.picture import picture_router
from src.api.routes.v1.user import user_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(user_router, prefix="", tags=["user"])
api_v1_router.include_router(picture_router, prefix="", tags=["picture"])
