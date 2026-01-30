import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = (
    f"postgresql://{os.getenv('PGUSER')}:"
    f"{os.getenv('PGPASSWORD')}@"
    f"{os.getenv('PGHOST')}/"
    f"{os.getenv('PGDATABASE')}"
    f"?sslmode={os.getenv('PGSSLMODE')}"
)

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
