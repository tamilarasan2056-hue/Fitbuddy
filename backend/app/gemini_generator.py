import os
import json
import logging
import re
from typing import Dict, Any, Optional
from dotenv import load_dotenv
from .schemas import WorkoutGenerateRequest, WorkoutPlanContent, DayPlan, Exercise

load_dotenv()
logger = logging.getLogger("fitbuddy.gemini")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# Try importing google generative SDKs
GENAI_SDK_AVAILABLE = False
try:
    import google.generativeai as genai
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
    GENAI_SDK_AVAILABLE = True
except ImportError:
    pass

try:
    from google import genai as new_genai
    NEW_GENAI_SDK_AVAILABLE = True
except ImportError:
    NEW_GENAI_SDK_AVAILABLE = False


def extract_json_from_text(text: str) -> Dict[str, Any]:
    """Extract clean JSON object from raw Gemini text response."""
    cleaned = text.strip()
    # Remove markdown code fences if present
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned)
    if match:
        cleaned = match.group(1).strip()
    return json.loads(cleaned)


def build_system_workout_prompt(profile: WorkoutGenerateRequest) -> str:
    """Constructs a comprehensive system prompt for the 7-day workout plan."""
    return f"""You are FitBuddy's elite fitness planning assistant and certified strength & conditioning specialist.
Generate a structured, safe, personalized 7-day workout plan for the following user:

USER PROFILE:
- Name: {profile.username} (ID: {profile.user_id})
- Age: {profile.age} years old
- Weight: {profile.weight} kg
- Primary Fitness Goal: {profile.fitness_goal}
- Target Workout Intensity: {profile.intensity}
- Experience Level: {profile.experience or "Beginner"}
- Available Session Duration: {profile.workout_time or "45 mins"}
- Equipment Access: {profile.equipment or "Full Gym"}
- Preferred Workout Style: {profile.preferred_style or "Balanced Strength & Cardio"}

STRICT OUTPUT FORMAT:
You MUST respond with a valid JSON object ONLY. Do not include introductory text, markdown commentary, or explanations outside the JSON.
The JSON must adhere precisely to this schema:
{{
  "split_title": "Descriptive Name of 7-Day Split (e.g. Upper/Lower + Conditioning Split)",
  "summary": "Brief 2-3 sentence overview of how this plan achieves {profile.fitness_goal} at {profile.intensity} intensity.",
  "estimated_weekly_calories": "Estimated weekly burn range (e.g. 1800-2400 kcal)",
  "week": [
    {{
      "day": 1,
      "title": "Workout Title (e.g. Lower Body Hypertrophy or Active Rest)",
      "focus": "Target muscle groups or focus (e.g. Quads, Hamstrings, Core)",
      "is_rest_day": false,
      "warmup": [
        {{"activity": "Dynamic leg swings & hip openers", "duration": "3 mins"}},
        {{"activity": "Bodyweight squats & glute bridges", "duration": "4 mins"}}
      ],
      "exercises": [
        {{
          "name": "Barbell or Goblet Squat",
          "sets": "3-4",
          "reps": "10-12",
          "duration": "N/A",
          "rest": "90s",
          "notes": "Keep chest elevated, knees tracking over toes."
        }}
      ],
      "cooldown": "5-10 minutes hamstring & hip flexor stretches",
      "recovery": "Hydrate with electrolytes and consume 25-30g protein post-workout",
      "safety_note": "If lower back strains, switch to dumbbell goblet squats."
    }}
  ]
}}

GUIDELINES:
1. Provide exactly 7 days (day 1 to 7).
2. Include 1 to 2 smart rest/active recovery days depending on intensity ({profile.intensity}) and experience ({profile.experience}).
3. On rest days, set "is_rest_day": true, include light mobility in warmup and cooldown, and leave "exercises" as an empty list or light stretching.
4. Adapt exercise selection to their equipment ({profile.equipment}) and experience ({profile.experience}).
5. Warmup should take 5-10 minutes.
6. Return only valid JSON.
"""


def generate_workout_gemini(profile: WorkoutGenerateRequest) -> WorkoutPlanContent:
    """Generates a complete 7-day workout plan using Gemini with intelligent fallback."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip() or GEMINI_API_KEY

    if api_key and GENAI_SDK_AVAILABLE:
        try:
            prompt = build_system_workout_prompt(profile)
            # Use gemini-2.5-flash or gemini-1.5-flash
            models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"]
            raw_text = None
            last_err = None

            for model_name in models_to_try:
                try:
                    model = genai.GenerativeModel(
                        model_name=model_name,
                        generation_config={
                            "temperature": 0.4,
                            "top_p": 0.95,
                            "response_mime_type": "application/json",
                        }
                    )
                    response = model.generate_content(prompt)
                    if response and response.text:
                        raw_text = response.text
                        break
                except Exception as e:
                    last_err = e
                    logger.warning(f"Model {model_name} failed: {e}. Trying next...")

            if raw_text:
                plan_json = extract_json_from_text(raw_text)
                return WorkoutPlanContent.model_validate(plan_json)
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}. Falling back to high-grade intelligent generator.")

    # High-grade deterministic personalized fallback if API key is absent or quota exceeded
    return generate_fallback_workout_plan(profile)


def generate_fallback_workout_plan(profile: WorkoutGenerateRequest) -> WorkoutPlanContent:
    """
    Intelligent certified-trainer fallback generator.
    Creates a tailored 7-day plan matching age, weight, goal, intensity, and equipment.
    """
    goal = profile.fitness_goal.lower()
    intensity = profile.intensity.lower()
    equip = (profile.equipment or "Full Gym").lower()
    time_avail = profile.workout_time or "45 mins"

    # Determine split style based on goal & intensity
    if "loss" in goal or "cardio" in goal:
        split_title = "Metabolic Fat-Loss & Conditioning 7-Day Cycle"
        summary = (
            f"Specially tailored for {profile.username} ({profile.age}yo, {profile.weight}kg) aiming for weight loss. "
            f"Combines high-density resistance training with cardiovascular intervals to maximize caloric expenditure at {profile.intensity} intensity."
        )
        cals = "2200-2800 kcal"
    elif "muscle" in goal or "strength" in goal:
        split_title = "Hypertrophy & Progressive Overload 7-Day Split"
        summary = (
            f"Designed for {profile.username} targeting muscle gain. Focuses on mechanical tension, volume progression, "
            f"and adequate recovery windows tailored for {profile.experience or 'Intermediate'} level."
        )
        cals = "1900-2400 kcal"
    elif "flex" in goal or "mobility" in goal:
        split_title = "Functional Mobility & Core Longevity Cycle"
        summary = (
            f"Gentle yet highly effective 7-day schedule optimizing joint mobility, postural alignment, and core stability for {profile.username}."
        )
        cals = "1400-1800 kcal"
    else:
        split_title = "Balanced Functional Strength & Wellness 7-Day Split"
        summary = (
            f"Comprehensive wellness schedule balancing upper/lower resistance work, steady-state cardio, and restorative active recovery for {profile.username}."
        )
        cals = "1700-2200 kcal"

    # Build 7 distinct days
    is_gym = "gym" in equip
    is_db = "dumbbell" in equip

    def make_ex(name, sets, reps, rest, notes):
        return Exercise(name=name, sets=sets, reps=reps, rest=rest, notes=notes)

    days = []

    # Day 1
    days.append(DayPlan(
        day=1,
        title="Full Body Foundation & Core Activation",
        focus="Quads, Chest, Back & Core",
        is_rest_day=False,
        warmup=[
            {"activity": "Jumping jacks or arm circles", "duration": "3 mins"},
            {"activity": "Bodyweight lunges & cat-cow flow", "duration": "4 mins"}
        ],
        exercises=[
            make_ex(
                "Barbell or Goblet Squat" if (is_gym or is_db) else "Tempo Air Squats",
                "3-4", "10-12 reps", "75s", "Keep chest upright and descend to parallel depth."
            ),
            make_ex(
                "Dumbbell Bench Press" if (is_gym or is_db) else "Push-ups (Incline or Standard)",
                3, "10-12 reps", "60s", "Controlled 2-second eccentric lowering phase."
            ),
            make_ex(
                "Lat Pulldown or Seated Cable Row" if is_gym else ("Dumbbell Single-Arm Row" if is_db else "Inverted Table Rows / Doorframe Rows"),
                3, "12 reps", "60s", "Squeeze shoulder blades firmly at peak contraction."
            ),
            make_ex(
                "Plank Hold with Shoulder Taps",
                3, "45 secs", "45s", "Brace core tightly, minimize hip sway."
            )
        ],
        cooldown="5 mins quad stretch, child's pose, and diaphragmatic breathing",
        recovery=f"Drink at least 2.5L water today. Prioritize 1.6-2.0g protein/kg ({int(profile.weight * 1.8)}g target).",
        safety_note="Warm up thoroughly before loading weight. Stop if you feel pinching in the shoulders."
    ))

    # Day 2
    days.append(DayPlan(
        day=2,
        title="Upper Body Strength & Postural Alignment",
        focus="Deltoids, Upper Back, Biceps & Triceps",
        is_rest_day=False,
        warmup=[
            {"activity": "Band pull-aparts or shoulder wall slides", "duration": "3 mins"},
            {"activity": "Bear crawl holds & wrist mobility", "duration": "3 mins"}
        ],
        exercises=[
            make_ex(
                "Dumbbell Overhead Shoulder Press" if (is_gym or is_db) else "Pike Push-ups",
                3, "10 reps", "75s", "Press overhead without arching the lower lumbar spine."
            ),
            make_ex(
                "Chest Supported Row or Bent-over DB Row" if (is_gym or is_db) else "Prone Cobra & Scapular Squeezes",
                3, "12 reps", "60s", "Focus on mid-back engagement and posture."
            ),
            make_ex(
                "Dumbbell Bicep Curls" if (is_gym or is_db) else "Bicep Towel Curls against Resistance",
                3, "12-15 reps", "45s", "Keep elbows stationary by your ribs."
            ),
            make_ex(
                "Overhead Tricep Extension or Dips",
                3, "12-15 reps", "45s", "Full elbow extension without flaring elbows out."
            )
        ],
        cooldown="6 mins doorway chest stretch and cross-body shoulder stretch",
        recovery="Focus on gentle neck and upper spine mobility before bed.",
        safety_note="Avoid hyperextending your lower back on overhead presses."
    ))

    # Day 3
    days.append(DayPlan(
        day=3,
        title="Active Rest, Mobility & Cardiovascular Recovery",
        focus="Joint Longevity, Aerobic Flush & Parasympathetic Reset",
        is_rest_day=True,
        warmup=[
            {"activity": "Gentle 15-minute brisk walk outdoors or light spin bike", "duration": "15 mins"}
        ],
        exercises=[],
        cooldown="10 mins full-body foam rolling and gentle yoga hip openers",
        recovery="Aim for an extra 30-45 minutes of sleep tonight for tissue regeneration.",
        safety_note="Keep heart rate below Zone 2 (conversational pace). Today is for restorative adaptation."
    ))

    # Day 4
    days.append(DayPlan(
        day=4,
        title="Posterior Chain, Glutes & Hamstring Development",
        focus="Hamstrings, Gluteus Maximus, Lower Back & Calves",
        is_rest_day=False,
        warmup=[
            {"activity": "Glute bridge holds & leg swings", "duration": "4 mins"},
            {"activity": "Inchworms with upward dog transition", "duration": "4 mins"}
        ],
        exercises=[
            make_ex(
                "Romanian Deadlift (Barbell or DB)" if (is_gym or is_db) else "Single-Leg Romanian Deadlift (Bodyweight)",
                4, "10 reps", "90s", "Hinge deeply at hips with a neutral spine; feel stretch in hamstrings."
            ),
            make_ex(
                "Walking Dumbbell Lunges" if (is_gym or is_db) else "Walking Bodyweight Lunges",
                3, "12 reps per leg", "60s", "Keep front shin vertical and maintain knee tracking."
            ),
            make_ex(
                "Hamstring Curl Machine or Swiss Ball Leg Curls" if is_gym else "Glute Bridge Single-Leg Marches",
                3, "15 reps", "60s", "Squeeze hamstrings at the peak of every rep."
            ),
            make_ex(
                "Standing Calf Raises",
                3, "20 reps", "45s", "Full pause at the top and stretch at the bottom."
            )
        ],
        cooldown="5 mins pigeon pose, figure-4 stretch, and calf wall stretch",
        recovery=f"Adequate complex carbohydrates (oats, brown rice, sweet potatoes) to replenish muscle glycogen.",
        safety_note="Keep spine rigid during deadlifts; do not round your back."
    ))

    # Day 5
    days.append(DayPlan(
        day=5,
        title="Cardiovascular Conditioning & High-Density Core",
        focus="Cardio Intervals, VO2 Max & Abdominal Strength",
        is_rest_day=False,
        warmup=[
            {"activity": "High knees & butt kicks", "duration": "3 mins"},
            {"activity": "Torso twists & mountain climbers (slow)", "duration": "3 mins"}
        ],
        exercises=[
            make_ex(
                "Interval Cardio (Rower, Assault Bike, or Sprint-Walks)" if is_gym else "High-Intensity Bodyweight Interval Circuit",
                "6 rounds", "45s work / 45s rest", "45s", f"Target 75-85% max heart rate according to {profile.intensity} intensity."
            ),
            make_ex(
                "Kettlebell or Dumbbell Swings" if (is_gym or is_db) else "Skater Hops & Speed Squats",
                3, "15-20 reps", "60s", "Explosive hip drive, snapping glutes at the top."
            ),
            make_ex(
                "Hanging Leg Raises" if is_gym else "Lying Reverse Crunches",
                3, "12 reps", "45s", "Controlled descent without swinging."
            ),
            make_ex(
                "Bicycle Crunches",
                3, "20 reps total", "45s", "Opposite elbow to opposite knee with steady tempo."
            )
        ],
        cooldown="7 mins gentle deep breathing, cobra stretch, and hamstring stretch",
        recovery="Replenish sodium and magnesium lost through perspiration.",
        safety_note="Scale interval speed to your current cardiovascular comfort."
    ))

    # Day 6
    days.append(DayPlan(
        day=6,
        title="Functional Full-Body Power & Muscular Endurance",
        focus="Compound Movement Patterns & Dynamic Core",
        is_rest_day=False,
        warmup=[
            {"activity": "Dynamic arm crossovers & deep squat hold", "duration": "4 mins"},
            {"activity": "Side lunges & thoracic rotations", "duration": "3 mins"}
        ],
        exercises=[
            make_ex(
                "Dumbbell Thrusters (Squat to Overhead Press)" if (is_gym or is_db) else "Bodyweight Jump Squats into Push-up",
                3, "10-12 reps", "75s", "Fluid transfer of leg drive into overhead press."
            ),
            make_ex(
                "Dumbbell Renegade Rows" if (is_gym or is_db) else "Plank to Downward Dog Reach",
                3, "8 reps per arm", "60s", "Keep pelvis parallel to floor without rotation."
            ),
            make_ex(
                "Step-ups on Box / Bench" if is_gym else "Chair / Stair Step-ups",
                3, "12 reps per leg", "60s", "Drive through the heel of the elevated foot."
            ),
            make_ex(
                "Russian Twists with Weight or Bodyweight",
                3, "24 total reps", "45s", "Rotate from thoracic spine, engaging obliques."
            )
        ],
        cooldown="6 mins child's pose, butterfly stretch, and quad roll",
        recovery="Take a warm Epsom salt bath to relax tense muscle fibers.",
        safety_note="Prioritize smooth form over speed or weight during compound thrusters."
    ))

    # Day 7
    days.append(DayPlan(
        day=7,
        title="Complete Rest, System Reset & Weekly Reflection",
        focus="Central Nervous System Recovery & Mental Decompression",
        is_rest_day=True,
        warmup=[
            {"activity": "Gentle 20-minute nature walk and mindful breathing", "duration": "20 mins"}
        ],
        exercises=[],
        cooldown="10 mins guided restorative stretching & progressive muscle relaxation",
        recovery="Review your weekly achievements, plan meals for next week, and hydrate generously.",
        safety_note="Allow your body to completely recover. Growth happens during rest periods."
    ))

    return WorkoutPlanContent(
        split_title=split_title,
        summary=summary,
        estimated_weekly_calories=cals,
        week=days
    )
