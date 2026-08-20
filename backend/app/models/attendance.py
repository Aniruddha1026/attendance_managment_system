from datetime import datetime, date, time
from sqlalchemy import Date, DateTime, Time, Integer, String, UniqueConstraint, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

class Attendance(Base):
    __tablename__="attendance"

    __table_args__=(
        UniqueConstraint(
            "employee_id",
            "attendance_date",
            name="unique_employee_attendance_date"
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employees.id"),
        nullable=False,
        index=True
    )

    attendance_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True
    )

    checkin_time: Mapped[time] = mapped_column(
        Time,
        nullable=True
    )

    checkout_time: Mapped[time] = mapped_column(
        Time,
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(10),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
        
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    employee=relationship(
        "Employee",
        back_populates="attendance_records"
    )