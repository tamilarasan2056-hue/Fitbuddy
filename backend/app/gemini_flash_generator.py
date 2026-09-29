import os
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("fitbuddy.gemini_flash")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

GENAI_SDK_AVAILABLE = False
try:
    import google.generativeai as genai
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
    GENAI_SDK_AVAILABLE = True
except ImportError:
    pass


def generate_nutrition_tip(fitness_goal: str, weight: float, intensity: str, age: int) -> str:
    """
    Generates a targeted, concise nutrition and recovery recommendation
    using a fast Gemini flash model with certified nutrition principles.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip() or GEMINI_API_KEY

    if api_key and GENAI_SDK_AVAILABLE:
        try:
            prompt = (
                f"You are FitBuddy's sports nutritionist. Provide a high-impact, practical 2-3 paragraph "
                f"nutrition and recovery strategy for an athlete with the following profile:\n"
                f"- Primary Goal: {fitness_goal}\n"
                f"- Body Weight: {weight} kg\n"
                f"- Training Intensity: {intensity}\n"
                f"- Age: {age} years old\n\n"
                f"Include:\n"
                f"1. Target Daily Protein & Hydration targets (specific numbers based on {weight}kg).\n"
                f"2. Pre- and Post-Workout Nutrient Timing tailored for {fitness_goal}.\n"
                f"3. Key Recovery & Sleep Guideline for peak muscular and hormonal recovery.\n"
                f"Keep tone encouraging, concise, bulleted where appropriate, and actionable without fluff."
            )

            models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"]
            for model_name in models_to_try:
                try:
                    model = genai.GenerativeModel(model_name=model_name)
                    response = model.generate_content(prompt)
                    if response and response.text:
                        return response.text.strip()
                except Exception as e:
                    logger.warning(f"Flash model {model_name} failed: {e}")
        except Exception as e:
            logger.error(f"Error calling Gemini flash for nutrition: {e}")

    # Certified sports nutrition fallback
    goal_lower = fitness_goal.lower()
    protein_low = int(weight * 1.6)
    protein_high = int(weight * 2.0)
    water_liters = round(weight * 0.035 + (0.75 if intensity.lower() == 'high' else 0.5), 1)

    if "muscle" in goal_lower or "bulk" in goal_lower:
        return (
            f"**Muscle Hypertrophy Nutrition & Recovery Protocol**\n\n"
            f"• **Macronutrient Fueling:** Target **{protein_low}–{protein_high}g protein daily** (~25-35g per meal across 4 meals). "
            f"Maintain a moderate caloric surplus (+300 to +400 kcal) with slow-digesting carbohydrates (brown rice, oats, sweet potatoes) to power heavy lifting.\n"
            f"• **Peri-Workout Window:** Consume 25g whey/plant protein + 40g fast-acting carbs (banana or dextrose) within 45 minutes post-training to replenish glycogen and trigger muscle protein synthesis.\n"
            f"• **Hydration & Sleep:** Drink at least **{water_liters} liters of water** daily. Aim for 7.5 to 8.5 hours of uninterrupted sleep—over 70% of natural growth hormone pulse occurs during deep slow-wave sleep."
        )
    elif "loss" in goal_lower or "cut" in goal_lower:
        return (
            f"**Fat-Loss & Lean Mass Preservation Protocol**\n\n"
            f"• **Targeted Deficit & High Satiety:** Aim for **{protein_high}g protein daily** to preserve metabolically active muscle tissue while in a mild caloric deficit (~300-500 kcal). "
            f"Prioritize voluminous leafy greens, lean poultry, tofu, and legumes to maintain full satiety.\n"
            f"• **Hydration Standard:** Consume **{water_liters} liters of water** throughout the day. Often thirst signals are misinterpreted as caloric hunger; drink a 500ml glass before each main meal.\n"
            f"• **Recovery & Cortisol Control:** Ensure 7–8 hours of quality rest. Chronic sleep deprivation spikes circulating cortisol and ghrelin (the hunger hormone), sabotaging fat oxidation."
        )
    elif "flex" in goal_lower or "mobility" in goal_lower:
        return (
            f"**Joint Health, Collagen & Mobility Recovery Protocol**\n\n"
            f"• **Anti-Inflammatory Nutrition:** Incorporate omega-3 rich fatty fish (salmon, sardines) or flax/chia seeds daily, alongside antioxidant-rich berries to mitigate joint friction and systemic inflammation.\n"
            f"• **Connective Tissue Support:** Target **{protein_low}g protein daily**, and consider pairing vitamin C-rich foods (bell peppers, oranges) before mobility routines to facilitate collagen synthesis in ligaments and tendons.\n"
            f"• **Hydration:** Drink **{water_liters}L of water** daily with a pinch of pink salt or electrolytes to maintain elasticity in muscle fascia and disc hydration in the spine."
        )
    else:
        return (
            f"**Optimal Longevity & Daily Vitality Protocol**\n\n"
            f"• **Balanced Fueling:** Target **{protein_low}–{protein_high}g protein daily** balanced with colorful vegetables, healthy fats (avocado, extra virgin olive oil), and whole grains for sustained glucose levels.\n"
            f"• **Hydration:** Consume **{water_liters} liters of water** daily. Keep a water bottle at your workstation and hydrate consistently before feeling thirsty.\n"
            f"• **Circadian Alignment:** Maintain consistent sleep-wake timing within 30 minutes every day. Stop eating 2.5 hours before bedtime for optimal metabolic resting state."
        )
