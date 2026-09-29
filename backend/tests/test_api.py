import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine
from app.utils.auth import STATIC_ADMIN_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "FitBuddy" in data["name"]
    assert data["status"] == "online"


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"


def test_generate_workout_validation():
    # Missing required fields
    response = client.post("/api/generate-workout", json={})
    assert response.status_code == 422

    # Invalid age (under 14)
    response = client.post("/api/generate-workout", json={
        "user_id": "test_user",
        "username": "Test User",
        "age": 10,
        "weight": 70,
        "fitness_goal": "Weight Loss",
        "intensity": "Medium"
    })
    assert response.status_code == 422


def test_generate_and_retrieve_workout():
    payload = {
        "user_id": "test_runner_101",
        "username": "Alex Turner",
        "age": 28,
        "weight": 75.5,
        "fitness_goal": "Muscle Gain",
        "intensity": "High",
        "experience": "Intermediate",
        "workout_time": "45 mins",
        "equipment": "Full Gym",
        "preferred_style": "Strength & Hypertrophy"
    }

    # Generate workout
    response = client.post("/api/generate-workout", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "test_runner_101"
    assert "week" in data["original_plan"]
    assert len(data["original_plan"]["week"]) == 7
    assert data["nutrition_tip"] is not None
    assert data["updated_plan"] is None

    # Retrieve plan
    get_res = client.get("/api/plans/test_runner_101")
    assert get_res.status_code == 200
    plan_data = get_res.json()
    assert plan_data["user_id"] == "test_runner_101"

    # Submit feedback
    fb_payload = {
        "user_id": "test_runner_101",
        "feedback": "I want more cardio and focus on core strength"
    }
    fb_res = client.post("/api/submit-feedback", json=fb_payload)
    assert fb_res.status_code == 200
    fb_data = fb_res.json()
    assert fb_data["updated_plan"] is not None
    assert "week" in fb_data["updated_plan"]
    assert len(fb_data["updated_plan"]["week"]) == 7
    # Verify original plan is still intact and preserved!
    assert fb_data["original_plan"] is not None


def test_admin_auth_and_management():
    # Unauthorized access
    unauth_res = client.get("/api/admin/stats")
    assert unauth_res.status_code == 401

    # Login
    login_res = client.post("/api/admin/login", json={
        "username": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD
    })
    assert login_res.status_code == 200
    token = login_res.json()["token"]

    headers = {"Authorization": f"Bearer {token}"}

    # Access stats
    stats_res = client.get("/api/admin/stats", headers=headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert "total_users" in stats
    assert "total_plans" in stats

    # List users
    users_res = client.get("/api/users", headers=headers)
    assert users_res.status_code == 200
    assert isinstance(users_res.json(), list)
