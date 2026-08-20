from datetime import date

from sqlalchemy import func, select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.attendance import Attendance
from app.models.employee import Employee
from app.schemas.attendance import AttendanceCreate, AttendanceUpdate


def create_attendance(
    db: Session,
    attendance_data: AttendanceCreate,
) -> Attendance:

    employee = db.get(
        Employee,
        attendance_data.employee_id,
    )

    if employee is None:
        raise ValueError("Employee not found")

    existing_attendance = db.scalar(
        select(Attendance).where(
            Attendance.employee_id == attendance_data.employee_id,
            Attendance.attendance_date == attendance_data.attendance_date,
        )
    )

    if existing_attendance:
        raise ValueError(
            "Attendance already marked for this employee on this date"
        )

    attendance = Attendance(
        employee_id=attendance_data.employee_id,
        attendance_date=attendance_data.attendance_date,
        checkin_time=attendance_data.checkin_time,
        checkout_time=attendance_data.checkout_time,
        status=attendance_data.status,
    )

    db.add(attendance)
    try:
        db.commit()
        db.refresh(attendance)

    except IntegrityError:
        db.rollback()

        raise ValueError(
            "Attendance already exists for this employee on this date"
        )
    return attendance


def get_attendance(
    db: Session,
    attendance_id: int,
) -> Attendance | None:

    return db.get(
        Attendance,
        attendance_id,
    )


def get_attendance_records(
    db: Session,
    page: int = 1,
    limit: int = 10,
    employee_id: int | None = None,
    attendance_date: date | None = None,
    attendance_status: str | None = None,
):
    offset = (page - 1) * limit

    query = select(Attendance)

    if employee_id:
        query = query.where(
            Attendance.employee_id == employee_id
        )

    if attendance_date:
        query = query.where(
            Attendance.attendance_date
            == attendance_date
        )

    if attendance_status:
        query = query.where(
            Attendance.status
            == attendance_status
        )

    count_query = select(
        func.count()
    ).select_from(
        query.subquery()
    )

    total = db.scalar(count_query) or 0

    query = (
        query
        .order_by(
            Attendance.attendance_date.desc(),
            Attendance.id.desc(),
        )
        .offset(offset)
        .limit(limit)
    )

    records = list(
        db.scalars(query).all()
    )

    return records, total

def get_attendance_summary(
    db: Session,
    employee_id: int | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
):
    query = select(Attendance)

    if employee_id:
        query = query.where(
            Attendance.employee_id == employee_id
        )

    if start_date:
        query = query.where(
            Attendance.attendance_date >= start_date
        )

    if end_date:
        query = query.where(
            Attendance.attendance_date <= end_date
        )

    records = list(db.scalars(query).all())

    summary = {
        "total_records": len(records),
        "present": 0,
        "absent": 0,
        "half_day": 0,
        "leave": 0,
    }

    for record in records:
        if record.status == "Present":
            summary["present"] += 1

        elif record.status == "Absent":
            summary["absent"] += 1

        elif record.status == "Half Day":
            summary["half_day"] += 1

        elif record.status == "Leave":
            summary["leave"] += 1

    return summary

def update_attendance(
    db: Session,
    attendance_id: int,
    attendance_data: AttendanceUpdate,
) -> Attendance:

    attendance = db.get(
        Attendance,
        attendance_id,
    )

    if attendance is None:
        raise ValueError(
            "Attendance record not found"
        )

    # Check if another record already exists
    # for this employee on the new date.
    existing_attendance = db.scalar(
        select(Attendance).where(
            Attendance.employee_id
            == attendance.employee_id,
            Attendance.attendance_date
            == attendance_data.attendance_date,
            Attendance.id != attendance_id,
        )
    )

    if existing_attendance:
        raise ValueError(
            "Attendance already exists for this employee on this date"
        )

    # Validate checkout time
    if (
        attendance_data.checkin_time
        and attendance_data.checkout_time
        and attendance_data.checkout_time
        <= attendance_data.checkin_time
    ):
        raise ValueError(
            "Checkout time must be after check-in time"
        )

    attendance.attendance_date = (
        attendance_data.attendance_date
    )

    attendance.checkin_time = (
        attendance_data.checkin_time
    )

    attendance.checkout_time = (
        attendance_data.checkout_time
    )

    attendance.status = (
        attendance_data.status
    )

    db.commit()
    db.refresh(attendance)

    return attendance

def delete_attendance(
    db: Session,
    attendance_id: int,
):
    attendance = db.get(
        Attendance,
        attendance_id,
    )

    if attendance is None:
        raise ValueError(
            "Attendance record not found"
        )

    db.delete(attendance)
    db.commit()

    return {
        "message": "Attendance record deleted successfully"
    }