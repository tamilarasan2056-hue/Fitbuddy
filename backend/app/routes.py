import datetime
import logging
from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from .database import get_db
from .models import User, WorkoutPlan
from .schemas import (
    WorkoutGenerateRequest,
    FeedbackSubmitRequest,
    UserResponse,
    WorkoutPlanResponse,
    AdminStats,
    AdminLoginRequest,
    AdminLoginResponse,
)
from .gemini_generator import generate_workout_gemini
from .gemini_flash_generator import generate_nutrition_tip
from .updated_plan import update_workout_plan
from .services.user_service import save_user, get_user, get_all_users, delete_user
from .services.plan_service import (
    save_plan,
    update_plan,
    get_latest_plan,
    get_original_plan,
    get_all_plans,
    deserialize_plan,
)
from .utils.auth import get_admin_user, STATIC_ADMIN_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD

logger = logging.getLogger("fitbuddy.routes")
router = APIRouter()


@router.get("/")
def root():
    return {
        "name": "FitBuddy AI Fitness Plan Generator API",
        "version": "1.0.0",
        "tagline": "Train Smarter. Eat Better. Powered by AI.",
        "status": "online",
        "docs_url": "/docs",
        "health_check": "/health"
    }


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Test database connection
        db.execute(func.now() if "postgresql" in str(db.bind.url) else func.datetime("now"))
        db_status = "connected"
    except Exception as e:
        logger.error(f"Health DB check failed: {e}")
        db_status = "degraded"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "ai_engine": "Google Gemini 2.5/1.5 & Fallback Engine Active"
    }


# ==================== ADMIN AUTH ====================

@router.post("/api/admin/login", response_model=AdminLoginResponse)
def admin_login(creds: AdminLoginRequest):
    if creds.username == ADMIN_USERNAME and creds.password == ADMIN_PASSWORD:
        return AdminLoginResponse(
            authenticated=True,
            token=STATIC_ADMIN_SECRET,
            message="Admin authentication successful"
        )
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid admin credentials"
    )


@router.get("/api/admin/stats", response_model=AdminStats)
def get_admin_stats(admin: str = Depends(get_admin_user), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_plans = db.query(WorkoutPlan).count()
    plans_updated = db.query(WorkoutPlan).filter(WorkoutPlan.updated_plan.isnot(None)).count()
    
    # Active users in the last 7 days (or total if less)
    recent_cutoff = datetime.datetime.utcnow() - datetime.timedelta(days=7)
    active_users = db.query(User).filter(User.updated_at >= recent_cutoff).count()
    if active_users == 0 and total_users > 0:
        active_users = total_users

    return AdminStats(
        total_users=total_users,
        total_plans=total_plans,
        plans_updated=plans_updated,
        active_users=active_users
    )


# ==================== WORKOUT GENERATION & FEEDBACK ====================

@router.post("/api/generate-workout", response_model=WorkoutPlanResponse)
def generate_workout(payload: WorkoutGenerateRequest, db: Session = Depends(get_db)):
    """
    Main endpoint:
    1. Validates and saves or updates the user profile
    2. Generates 7-day personalized workout plan via Gemini
    3. Generates sports nutrition & recovery recommendation via Gemini flash
    4. Persists the plan in database
    5. Returns the structured response
    """
    try:
        # Step 1: Save or update User in DB
        user = save_user(db, payload)

        # Step 2: Generate 7-Day Workout Plan
        workout_plan_content = generate_workout_gemini(payload)

        # Step 3: Generate Nutrition & Recovery Tip
        nutrition_tip = generate_nutrition_tip(
            fitness_goal=payload.fitness_goal,
            weight=payload.weight,
            intensity=payload.intensity,
            age=payload.age
        )

        # Step 4: Persist in WorkoutPlan database table
        saved_plan = save_plan(
            db=db,
            user_id=user.user_id,
            original_plan=workout_plan_content,
            nutrition_tip=nutrition_tip
        )

        return WorkoutPlanResponse(
            id=saved_plan.id,
            user_id=saved_plan.user_id,
            original_plan=deserialize_plan(saved_plan.original_plan),
            updated_plan=deserialize_plan(saved_plan.updated_plan),
            nutrition_tip=saved_plan.nutrition_tip,
            feedback=saved_plan.feedback,
            created_at=saved_plan.created_at.isoformat() if saved_plan.created_at else None,
            updated_at=saved_plan.updated_at.isoformat() if saved_plan.updated_at else None,
        )
    except Exception as e:
        logger.error(f"Error generating workout plan: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate your fitness plan right now. Please verify your input and try again."
        )


@router.post("/api/submit-feedback", response_model=WorkoutPlanResponse)
def submit_feedback(payload: FeedbackSubmitRequest, db: Session = Depends(get_db)):
    """
    Regenerates a plan based on client feedback:
    1. Fetches existing user profile and original plan
    2. Sends original plan + feedback + profile to Gemini
    3. Saves updated plan separately (original is preserved!)
    4. Returns updated plan
    """
    user = get_user(db, payload.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User '{payload.user_id}' not found."
        )

    current_plan = get_latest_plan(db, payload.user_id)
    if not current_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No workout plan found for user '{payload.user_id}'. Please generate an initial plan first."
        )

    try:
        original_dict = deserialize_plan(current_plan.original_plan)
        user_profile_dict = user.to_dict()

        # Update workout plan via Gemini
        updated_content = update_workout_plan(
            original_plan_dict=original_dict,
            user_profile=user_profile_dict,
            feedback=payload.feedback
        )

        # Save updated plan in DB (preserves original_plan)
        saved = update_plan(
            db=db,
            user_id=payload.user_id,
            updated_plan=updated_content,
            feedback=payload.feedback
        )

        return WorkoutPlanResponse(
            id=saved.id,
            user_id=saved.user_id,
            original_plan=deserialize_plan(saved.original_plan),
            updated_plan=deserialize_plan(saved.updated_plan),
            nutrition_tip=saved.nutrition_tip,
            feedback=saved.feedback,
            created_at=saved.created_at.isoformat() if saved.created_at else None,
            updated_at=saved.updated_at.isoformat() if saved.updated_at else None,
        )
    except Exception as e:
        logger.error(f"Error regenerating plan with feedback: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to regenerate workout plan with your feedback. Please try again."
        )


# ==================== USERS & PLANS RETRIEVAL ====================

@router.get("/api/users", response_model=List[UserResponse])
def list_users(
    search: Optional[str] = Query(None, description="Search by username, user_id, or goal"),
    admin: str = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Admin-protected: List registered users with optional search."""
    users = get_all_users(db, search=search)
    return [
        UserResponse(
            id=u.id,
            user_id=u.user_id,
            username=u.username,
            age=u.age,
            weight=u.weight,
            fitness_goal=u.fitness_goal,
            intensity=u.intensity,
            experience=u.experience,
            workout_time=u.workout_time,
            equipment=u.equipment,
            created_at=u.created_at.isoformat() if u.created_at else None,
            updated_at=u.updated_at.isoformat() if u.updated_at else None,
        )
        for u in users
    ]


@router.get("/api/users/{user_id}", response_model=UserResponse)
def get_user_profile(user_id: str, db: Session = Depends(get_db)):
    """Retrieve specific user profile."""
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{user_id}' not found.")
    return UserResponse(
        id=user.id,
        user_id=user.user_id,
        username=user.username,
        age=user.age,
        weight=user.weight,
        fitness_goal=user.fitness_goal,
        intensity=user.intensity,
        experience=user.experience,
        workout_time=user.workout_time,
        equipment=user.equipment,
        created_at=user.created_at.isoformat() if user.created_at else None,
        updated_at=user.updated_at.isoformat() if user.updated_at else None,
    )


@router.get("/api/plans/{user_id}", response_model=WorkoutPlanResponse)
def get_user_plan(user_id: str, db: Session = Depends(get_db)):
    """Retrieve the latest workout plan and nutrition tip for a user."""
    plan = get_latest_plan(db, user_id)
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No plan found for user '{user_id}'.")
    
    return WorkoutPlanResponse(
        id=plan.id,
        user_id=plan.user_id,
        original_plan=deserialize_plan(plan.original_plan),
        updated_plan=deserialize_plan(plan.updated_plan),
        nutrition_tip=plan.nutrition_tip,
        feedback=plan.feedback,
        created_at=plan.created_at.isoformat() if plan.created_at else None,
        updated_at=plan.updated_at.isoformat() if plan.updated_at else None,
    )


@router.delete("/api/users/{user_id}")
def remove_user(
    user_id: str,
    admin: str = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Admin-protected: Delete a user and associated plans."""
    success = delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{user_id}' not found.")
    return {"success": True, "message": f"User '{user_id}' and all associated plans have been deleted."}
