import json
from typing import List, Optional, Dict, Any, Union
from sqlalchemy.orm import Session
from ..models import WorkoutPlan
import datetime


def serialize_plan(plan_data: Union[Dict, str, Any]) -> str:
    """Helper to ensure plan data is serialized to JSON string."""
    if isinstance(plan_data, str):
        return plan_data
    if hasattr(plan_data, "model_dump"):
        return json.dumps(plan_data.model_dump())
    if hasattr(plan_data, "dict"):
        return json.dumps(plan_data.dict())
    return json.dumps(plan_data)


def deserialize_plan(raw: Optional[str]) -> Optional[Dict[str, Any]]:
    """Helper to safely deserialize JSON string to dict."""
    if not raw:
        return None
    try:
        return json.loads(raw)
    except Exception:
        return {"raw_text": raw}


def save_plan(
    db: Session,
    user_id: str,
    original_plan: Union[Dict, str, Any],
    nutrition_tip: str
) -> WorkoutPlan:
    """Save newly generated original workout plan for user."""
    serialized_plan = serialize_plan(original_plan)
    
    # Check if a plan already exists for this user; we update or create new
    existing_plan = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user_id).order_by(WorkoutPlan.created_at.desc()).first()
    
    if existing_plan and not existing_plan.updated_plan:
        # User is regenerating a fresh plan without prior feedback
        existing_plan.original_plan = serialized_plan
        existing_plan.nutrition_tip = nutrition_tip
        existing_plan.updated_plan = None
        existing_plan.feedback = None
        existing_plan.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(existing_plan)
        return existing_plan
    
    # Otherwise create a new record
    new_plan = WorkoutPlan(
        user_id=user_id,
        original_plan=serialized_plan,
        updated_plan=None,
        nutrition_tip=nutrition_tip,
        feedback=None,
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow(),
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return new_plan


def update_plan(
    db: Session,
    user_id: str,
    updated_plan: Union[Dict, str, Any],
    feedback: str
) -> Optional[WorkoutPlan]:
    """Save feedback-based regenerated plan while preserving the original plan."""
    plan = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user_id).order_by(WorkoutPlan.created_at.desc()).first()
    if not plan:
        return None
    
    serialized_update = serialize_plan(updated_plan)
    plan.updated_plan = serialized_update
    plan.feedback = feedback
    plan.updated_at = datetime.datetime.utcnow()
    
    db.commit()
    db.refresh(plan)
    return plan


def get_original_plan(db: Session, user_id: str) -> Optional[WorkoutPlan]:
    """Retrieve original plan for a user."""
    return db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user_id).order_by(WorkoutPlan.created_at.asc()).first()


def get_latest_plan(db: Session, user_id: str) -> Optional[WorkoutPlan]:
    """Retrieve latest plan for a user."""
    return db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user_id).order_by(WorkoutPlan.created_at.desc()).first()


def get_all_plans(db: Session, limit: int = 100, offset: int = 0) -> List[WorkoutPlan]:
    """Retrieve all workout plans."""
    return db.query(WorkoutPlan).order_by(WorkoutPlan.created_at.desc()).offset(offset).limit(limit).all()


def delete_plan(db: Session, plan_id: int) -> bool:
    """Delete a plan by ID."""
    plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == plan_id).first()
    if not plan:
        return False
    db.delete(plan)
    db.commit()
    return True
