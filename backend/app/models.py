import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(100), unique=True, index=True, nullable=False)
    username = Column(String(150), nullable=False)
    age = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)  # in kg
    fitness_goal = Column(String(100), nullable=False)  # Weight Loss, Muscle Gain, General Wellness, Flexibility
    intensity = Column(String(50), nullable=False)  # Low, Medium, High
    experience = Column(String(100), nullable=True)  # Beginner, Intermediate, Advanced
    workout_time = Column(String(50), nullable=True)  # e.g., "30 mins", "45 mins", "60 mins"
    equipment = Column(String(100), nullable=True)  # Bodyweight, Dumbbells, Full Gym
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships
    plans = relationship("WorkoutPlan", back_populates="user", cascade="all, delete-orphan", order_by="desc(WorkoutPlan.created_at)")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username": self.username,
            "age": self.age,
            "weight": self.weight,
            "fitness_goal": self.fitness_goal,
            "intensity": self.intensity,
            "experience": self.experience,
            "workout_time": self.workout_time,
            "equipment": self.equipment,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(100), ForeignKey("users.user_id", ondelete="CASCADE"), index=True, nullable=False)
    original_plan = Column(Text, nullable=False)  # JSON-serialized string of 7-day workout plan
    updated_plan = Column(Text, nullable=True)   # JSON-serialized string of updated 7-day plan
    nutrition_tip = Column(Text, nullable=False)  # Nutrition & recovery recommendation text
    feedback = Column(Text, nullable=True)       # User feedback submitted for regeneration
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="plans")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "original_plan": self.original_plan,
            "updated_plan": self.updated_plan,
            "nutrition_tip": self.nutrition_tip,
            "feedback": self.feedback,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
