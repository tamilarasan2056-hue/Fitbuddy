from typing import List, Optional
from sqlalchemy.orm import Session
from ..models import User
from ..schemas import WorkoutGenerateRequest
import datetime


def save_user(db: Session, user_data: WorkoutGenerateRequest) -> User:
    """Save or update user information in the database."""
    user = db.query(User).filter(User.user_id == user_data.user_id).first()
    if user:
        # Update existing user attributes
        user.username = user_data.username
        user.age = user_data.age
        user.weight = user_data.weight
        user.fitness_goal = user_data.fitness_goal
        user.intensity = user_data.intensity
        user.experience = user_data.experience
        user.workout_time = user_data.workout_time
        user.equipment = user_data.equipment
        user.updated_at = datetime.datetime.utcnow()
    else:
        # Create new user
        user = User(
            user_id=user_data.user_id,
            username=user_data.username,
            age=user_data.age,
            weight=user_data.weight,
            fitness_goal=user_data.fitness_goal,
            intensity=user_data.intensity,
            experience=user_data.experience,
            workout_time=user_data.workout_time,
            equipment=user_data.equipment,
            created_at=datetime.datetime.utcnow(),
            updated_at=datetime.datetime.utcnow(),
        )
        db.add(user)
    
    db.commit()
    db.refresh(user)
    return user


def get_user(db: Session, user_id: str) -> Optional[User]:
    """Retrieve user by unique user_id."""
    return db.query(User).filter(User.user_id == user_id).first()


def get_all_users(db: Session, search: Optional[str] = None, limit: int = 100, offset: int = 0) -> List[User]:
    """Retrieve all registered users with optional search."""
    query = db.query(User)
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            (User.user_id.ilike(search_fmt)) |
            (User.username.ilike(search_fmt)) |
            (User.fitness_goal.ilike(search_fmt))
        )
    return query.order_by(User.created_at.desc()).offset(offset).limit(limit).all()


def delete_user(db: Session, user_id: str) -> bool:
    """Delete a user and cascading plans."""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        return False
    db.delete(user)
    db.commit()
    return True
