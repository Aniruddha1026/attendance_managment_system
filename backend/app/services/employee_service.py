from fastapi import HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
from app.models.attendance import Attendance

def create_employee(db: Session, employee_data: EmployeeCreate) -> Employee:
    employee=Employee(
        employee_id=employee_data.employee_id,
        name=employee_data.name,
        email=employee_data.email,
        mobile_number=employee_data.mobile_number,
        department=employee_data.department,
        designation=employee_data.designation,
        status=employee_data.status,
    )

    existing_employee = db.scalar(
    select(Employee).where(
        or_(
            Employee.employee_id == employee_data.employee_id,
            Employee.email == employee_data.email,
            Employee.mobile_number == employee_data.mobile_number
        )
    )
)

    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Employee ID, email, or mobile number already exists"
    )    

    db.add(employee)
    db.commit()
    db.refresh(employee)

    return employee

def get_employee(db: Session, employee_id: int) -> Employee | None:
    return db.get(Employee, employee_id)

def get_employees(
        db: Session,
        page: int = 1,
        limit: int = 10,
        search: str | None = None,
        department: str | None = None,
        status: str | None = None
) -> tuple[list[Employee],int]:

    offset=(page-1)*limit
    query=select(Employee)

    if search:
        search_term= f"%{search}%"

        query=query.where(
            or_(
                Employee.employee_id.ilike(search_term),
                Employee.name.ilike(search_term),
                Employee.email.ilike(search_term)
            )
        )

    if department:
        query=query.where(Employee.department==department)

    if status:
        query=query.where(Employee.status==status)

    count_query=select(func.count()).select_from(query.subquery())

    total=db.scalar(count_query) or 0

    query= (query.order_by(Employee.id.desc()).offset(offset).limit(limit))

    employees=list(db.scalars(query).all())

    return employees, total

def update_employee(db: Session, employee: Employee, employee_data: EmployeeUpdate) -> Employee:
    update_data=employee_data.model_dump(exclude_unset=True)

    for field,value in update_data.items():
        setattr(employee,field,value)

    db.commit()
    db.refresh(employee)

    return employee

def delete_employee(db: Session, employee_id: int):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    attendance_count = (
        db.query(func.count(Attendance.id))
        .filter(
            Attendance.employee_id == employee.id
        )
        .scalar()
    )

    if attendance_count > 0:
        raise HTTPException(
            status_code=409,
            detail=(
                "Employee cannot be deleted because "
                "attendance records exist. "
                "Set the employee status to Inactive instead."
            )
        )

    db.delete(employee)
    db.commit()

    return {
        "message": "Employee deleted successfully"
    }
