import os
import secrets
import hashlib
from typing import Optional
from fastapi import HTTPException, Security, status, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials, HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

load_dotenv()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "fitbuddy_admin_2026")

# Generate a deterministic session token based on admin secret
STATIC_ADMIN_SECRET = hashlib.sha256(f"{ADMIN_USERNAME}:{ADMIN_PASSWORD}".encode()).hexdigest()

security_bearer = HTTPBearer(auto_error=False)
security_basic = HTTPBasic(auto_error=False)


def verify_admin_credentials(credentials: HTTPBasicCredentials) -> bool:
    """Validate HTTP Basic username and password against configured admin env."""
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    return correct_username and correct_password


def verify_admin_token(token: str) -> bool:
    """Validate bearer token."""
    return secrets.compare_digest(token, STATIC_ADMIN_SECRET)


def get_admin_user(
    bearer: Optional[HTTPAuthorizationCredentials] = Security(security_bearer),
    basic: Optional[HTTPBasicCredentials] = Security(security_basic)
) -> str:
    """Dependency that ensures requests to admin endpoints are properly authorized."""
    if bearer and bearer.credentials:
        if verify_admin_token(bearer.credentials):
            return ADMIN_USERNAME
    if basic:
        if verify_admin_credentials(basic):
            return ADMIN_USERNAME
            
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorized: Admin credentials required",
        headers={"WWW-Authenticate": "Bearer"},
    )
