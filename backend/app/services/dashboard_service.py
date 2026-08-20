from datetime import date

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.employee import Employee


def get_dashboard_statistics(
    db: Session,
):
    today = date.today()

    total_employees = db.scalar(
        select(func.count(Employee.id))
    ) or 0

    active_employees = db.scalar(
        select(func.count(Employee.id))
        .where(Employee.status == "active")
    ) or 0

    present_today = db.scalar(
        select(func.count(Attendance.id))
        .where(
            Attendance.attendance_date == today,
            Attendance.status == "Present",
        )
    ) or 0

    absent_today = db.scalar(
        select(func.count(Attendance.id))
        .where(
            Attendance.attendance_date == today,
            Attendance.status == "Absent",
        )
    ) or 0

    half_day_today = db.scalar(
        select(func.count(Attendance.id))
        .where(
            Attendance.attendance_date == today,
            Attendance.status == "Half Day",
        )
    ) or 0

    leave_today = db.scalar(
        select(func.count(Attendance.id))
        .where(
            Attendance.attendance_date == today,
            Attendance.status == "Leave",
        )
    ) or 0

    department_query = (
        select(
            Employee.department,
            func.count(Employee.id),
        )
        .group_by(Employee.department)
        .order_by(Employee.department)
    )

    department_results = db.execute(
        department_query
    ).all()

    department_counts = [
        {
            "department": department,
            "employee_count": employee_count,
        }
        for department, employee_count
        in department_results
    ]

    return {
        "total_employees": total_employees,
        "active_employees": active_employees,
        "present_today": present_today,
        "absent_today": absent_today,
        "half_day_today": half_day_today,
        "leave_today": leave_today,
        "department_counts": department_counts,
    }