from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_admin
from app.database.connection import get_db
from app.models.employee import Employee
from app.models.user import User
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from app.services.employee_service import create_employee,delete_employee,get_employee,get_employees,update_employee

router= APIRouter(
    prefix="/api/employees",
    tags=["Employees"]
)

@router.post("",response_model=EmployeeResponse,status_code=status.HTTP_201_CREATED)
def create_employee_endpoint(employee_data: EmployeeCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return create_employee(db,employee_data)

@router.get("")
def list_employees(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10,ge=1,le=100),
    search: str | None = None,
    department: str | None = None,
    employee_status: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):

    employees, total= get_employees(
        db=db,
        page=page,
        limit=limit,
        search=search,
        department=department,
        status=employee_status
    )

    return {
        "data": employees,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (
            (total + limit -1) // limit
            if total
            else 0
        )
    }

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee_by_id(employee_id: int, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    employee= get_employee(db, employee_id)

    if employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Employere not found")

    return employee

@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee_endpoint(
    employee_id: int,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    employee= get_employee(db, employee_id)

    if employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )

    return update_employee(db, employee, employee_data)

@router.delete("/{employee_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_employee_endpoint(employee_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return delete_employee(db, employee_id)
    