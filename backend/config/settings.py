import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USERNAME = os.getenv("DB_USERNAME", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "postgres")

JWT_SECRET = os.getenv("JWT_SECRET_KEY", "changeme")
JWT_ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


# Encode password & dbname (handles spaces/special chars)
DATABASE_URL = (
    f"postgresql://{DB_USERNAME}:{quote_plus(DB_PASSWORD)}@"
    f"{DB_HOST}:{DB_PORT}/{quote_plus(DB_NAME)}"
)