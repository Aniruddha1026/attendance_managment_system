from sqlalchemy import select

from app.core.security import hash_password
from app.database.connection import SessionLocal
from app.models.user import User


def create_admin():
    db = SessionLocal()

    try:
        existing_user = db.scalar(
            select(User).where(
                User.username == "admin"
            )
        )

        if existing_user:
            print("Admin user already exists.")
            return

        admin = User(
            username="admin",
            password_hash=hash_password("admin123"),
            role="admin",
            is_active=True,
        )

        db.add(admin)
        db.commit()

        print("Admin user created successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()