import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    port: int = int(os.getenv("PORT", "3006"))
    jwt_secret: str = os.getenv("JWT_SECRET", "your-super-secret-jwt-key-here")
    db_host: str = os.getenv("DB_HOST", "localhost")
    db_port: int = int(os.getenv("DB_PORT", "3306"))
    db_user: str = os.getenv("DB_USER", "root")
    db_password: str = os.getenv("DB_PASSWORD", "12345")
    db_name: str = os.getenv("DB_NAME", "test_db")

settings = Settings()
