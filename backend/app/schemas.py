from typing import List, Optional, Union, Any, Dict
from pydantic import BaseModel, Field, field_validator
import datetime


class WarmupItem(BaseModel):
    activity: str
    duration: str = "2-3 mins"


class Exercise(BaseModel):
    name: str
    sets: Union[int, str] = 3
    reps: str = "10-12 reps"
    duration: Optional[str] = None
    rest: str = "60s"
    notes: Optional[str] = None


class DayPlan(BaseModel):
    day: int = Field(..., ge=1, le=7)
    title: str
    focus: str
    is_rest_day: bool = False
    warmup: Union[List[WarmupItem], List[str]] = []
    exercises: List[Exercise] = []
    cooldown: str = "5 minutes gentle static stretching & deep breathing"
    recovery: str = "Stay hydrated and aim for 7-9 hours of sleep"
    safety_note: str = "Maintain proper form; stop if you experience sharp pain."


class WorkoutPlanContent(BaseModel):
    split_title: str
    summary: str
    estimated_weekly_calories: Optional[str] = "1500-2200 kcal"
    week: List[DayPlan]


class WorkoutGenerateRequest(BaseModel):
    user_id: str = Field(..., min_length=2, max_length=100, description="Unique identifier for user")
    username: str = Field(..., min_length=2, max_length=150, description="User's display or full name")
    age: int = Field(..., ge=14, le=100, description="User age between 14 and 100")
    weight: float = Field(..., ge=25.0, le=350.0, description="User weight in kg")
    fitness_goal: str = Field(..., description="Weight Loss, Muscle Gain, General Wellness, Flexibility, etc.")
    intensity: str = Field(..., description="Low, Medium, or High")
    experience: Optional[str] = Field("Beginner", description="Beginner, Intermediate, Advanced")
    workout_time: Optional[str] = Field("45 mins", description="Available time per session")
    equipment: Optional[str] = Field("Full Gym", description="Bodyweight, Dumbbells, Full Gym")
    preferred_style: Optional[str] = Field("Mixed Strength & Cardio", description="Strength, HIIT, Cardio, Yoga/Mobility")

    @field_validator("user_id", "username")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Field cannot be blank")
        return s


class FeedbackSubmitRequest(BaseModel):
    user_id: str = Field(..., min_length=2, max_length=100)
    feedback: str = Field(..., min_length=3, max_length=1000, description="Feedback or adjustments desired")

    @field_validator("feedback")
    @classmethod
    def check_feedback(cls, v: str) -> str:
        s = v.strip()
        if len(s) < 3:
            raise ValueError("Feedback must be at least 3 characters long")
        return s


class UserResponse(BaseModel):
    id: int
    user_id: str
    username: str
    age: int
    weight: float
    fitness_goal: str
    intensity: str
    experience: Optional[str] = None
    workout_time: Optional[str] = None
    equipment: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = {"from_attributes": True}


class WorkoutPlanResponse(BaseModel):
    id: int
    user_id: str
    original_plan: Any
    updated_plan: Optional[Any] = None
    nutrition_tip: str
    feedback: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = {"from_attributes": True}


class AdminStats(BaseModel):
    total_users: int
    total_plans: int
    plans_updated: int
    active_users: int


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AdminLoginResponse(BaseModel):
    authenticated: bool
    token: str
    message: str
