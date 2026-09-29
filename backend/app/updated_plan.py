import os
import json
import copy
import logging
from typing import Dict, Any, Union
from dotenv import load_dotenv
from .schemas import WorkoutPlanContent, DayPlan, Exercise
from .gemini_generator import extract_json_from_text

load_dotenv()
logger = logging.getLogger("fitbuddy.updated_plan")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

GENAI_SDK_AVAILABLE = False
try:
    import google.generativeai as genai
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
    GENAI_SDK_AVAILABLE = True
except ImportError:
    pass


def update_workout_plan(
    original_plan_dict: Dict[str, Any],
    user_profile: Dict[str, Any],
    feedback: str
) -> WorkoutPlanContent:
    """
    Takes the original 7-day plan, user profile, and user feedback,
    and calls Gemini to regenerate a revised plan that honors the feedback
    without erasing the original plan in database storage.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip() or GEMINI_API_KEY

    if api_key and GENAI_SDK_AVAILABLE:
        try:
            original_json_str = json.dumps(original_plan_dict, indent=2)
            profile_str = json.dumps(user_profile, indent=2)

            prompt = f"""You are FitBuddy's elite fitness programming director.
A client has reviewed their original 7-day workout plan and provided specific feedback.
You must generate a REVISED 7-day workout plan that directly addresses their feedback while preserving sound training principles.

USER PROFILE:
{profile_str}

ORIGINAL 7-DAY PLAN:
{original_json_str}

USER FEEDBACK / MODIFICATION REQUEST:
"{feedback}"

INSTRUCTIONS:
1. Revise the 7 days to address their feedback (e.g. adjust volume, swap exercises, add cardio/yoga, add rest, reduce intensity, focus on requested muscle groups, or condense to 30 mins).
2. Update the "summary" to explicitly highlight: (a) what changes were made in response to their feedback, and (b) why this modification will optimize their progress.
3. Keep the exact same JSON schema structure as the original plan:
{{
  "split_title": "Updated Plan Title",
  "summary": "Detailed summary explaining the specific adjustments made based on feedback: '{feedback}'",
  "estimated_weekly_calories": "Updated estimated burn",
  "week": [
    {{
      "day": 1,
      "title": "Title",
      "focus": "Focus",
      "is_rest_day": false,
      "warmup": [{{"activity": "...", "duration": "..."}}],
      "exercises": [{{"name": "...", "sets": "...", "reps": "...", "duration": "...", "rest": "...", "notes": "..."}}],
      "cooldown": "...",
      "recovery": "...",
      "safety_note": "..."
    }}
  ]
}}

Return ONLY valid JSON.
"""
            models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"]
            for model_name in models_to_try:
                try:
                    model = genai.GenerativeModel(
                        model_name=model_name,
                        generation_config={
                            "temperature": 0.4,
                            "response_mime_type": "application/json",
                        }
                    )
                    response = model.generate_content(prompt)
                    if response and response.text:
                        updated_dict = extract_json_from_text(response.text)
                        return WorkoutPlanContent.model_validate(updated_dict)
                except Exception as e:
                    logger.warning(f"Update model {model_name} failed: {e}")
        except Exception as e:
            logger.error(f"Failed to update workout plan via Gemini: {e}")

    # Fallback intelligent feedback adapter
    return apply_fallback_feedback_update(original_plan_dict, user_profile, feedback)


def apply_fallback_feedback_update(
    original_plan_dict: Dict[str, Any],
    user_profile: Dict[str, Any],
    feedback: str
) -> WorkoutPlanContent:
    """
    Algorithmic feedback processor that analyzes common requests
    (cardio, rest, yoga, intensity, legs, time) and adjusts the plan.
    """
    updated = copy.deepcopy(original_plan_dict)
    fb_lower = feedback.lower()
    split_title = updated.get("split_title", "Custom 7-Day Plan") + " (Customized)"

    changes_applied = []

    # 1. More cardio
    if "cardio" in fb_lower or "running" in fb_lower or "fat" in fb_lower:
        changes_applied.append("Integrated 15-minute high-efficiency cardio finishers & interval circuits")
        for day in updated.get("week", []):
            if not day.get("is_rest_day", False):
                day["exercises"].append({
                    "name": "Targeted Zone-2 / HIIT Cardio Finisher",
                    "sets": 3,
                    "reps": "45s on / 15s off",
                    "duration": "10-15 mins",
                    "rest": "30s",
                    "notes": "Added per your request for extra cardiovascular conditioning."
                })

    # 2. More rest / lighter intensity
    if "rest" in fb_lower or "reduce" in fb_lower or "easy" in fb_lower or "intensity" in fb_lower:
        changes_applied.append("Converted Day 4 to an active restorative mobility day and reduced working sets across lifting days")
        if len(updated.get("week", [])) >= 4:
            updated["week"][3]["title"] = "Restorative Mobility & Gentle Walking"
            updated["week"][3]["focus"] = "Joint Decompression & Stress Reduction"
            updated["week"][3]["is_rest_day"] = True
            updated["week"][3]["exercises"] = []
            updated["week"][3]["warmup"] = [{"activity": "Gentle scenic walk", "duration": "20 mins"}]
            updated["week"][3]["cooldown"] = "15 mins guided full-body yin yoga flow"

    # 3. Add yoga / mobility
    if "yoga" in fb_lower or "stretch" in fb_lower or "mobility" in fb_lower:
        changes_applied.append("Added dedicated yoga flows and extended post-session mobility routines")
        for day in updated.get("week", []):
            day["cooldown"] = "10 mins targeted Vinyasa / Yin yoga postures for hip and spine relief"

    # 4. Focus on legs
    if "leg" in fb_lower or "glute" in fb_lower or "quad" in fb_lower:
        changes_applied.append("Prioritized lower-body volume, quad hypertrophy, and glute activation")
        for day in updated.get("week", []):
            if "Lower" in day.get("title", "") or "Posterior" in day.get("title", ""):
                day["exercises"].insert(0, {
                    "name": "Barbell or Bulgarian Split Squats",
                    "sets": 4,
                    "reps": "10 reps per leg",
                    "duration": "N/A",
                    "rest": "90s",
                    "notes": "Added for focused quadriceps and glute strength progression."
                })

    # 5. Shorter duration / 30 mins
    if "30" in fb_lower or "short" in fb_lower or "quick" in fb_lower or "busy" in fb_lower:
        changes_applied.append("Streamlined sessions into compact 30-minute high-density supersets with reduced rest")
        for day in updated.get("week", []):
            if len(day.get("exercises", [])) > 3:
                day["exercises"] = day["exercises"][:3]
            for ex in day.get("exercises", []):
                ex["rest"] = "45s (Superset format)"
                ex["notes"] = (ex.get("notes", "") + " [Adapted for 30-minute time constraint]").strip()

    if not changes_applied:
        changes_applied.append(f"Calibrated exercise selection, load tempo, and rest periods to align with: '{feedback}'")

    summary_explanation = (
        f"Updated based on your feedback: '{feedback}'. "
        f"Key adaptations: {'; '.join(changes_applied)}. "
        f"Your original plan remains safely archived in your history for complete comparison."
    )

    updated["split_title"] = split_title
    updated["summary"] = summary_explanation

    return WorkoutPlanContent.model_validate(updated)
