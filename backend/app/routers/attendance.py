from datetime import date

from fastapi import APIRouter,Depends,HTTPException,Query,status

from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_admin
from app.database.connection import get_db
from app.models.user import User
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceResponse,
    AttendanceUpdate
)
from app.services.attendance_service import (
    create_attendance,
    get_attendance,
    get_attendance_records,
    get_attendance_summary,
    update_attendance,
    delete_attendance

)


router = APIRouter(
    prefix="/api/attendance",
    tags=["Attendance"],
)


@router.post("",response_model=AttendanceResponse,status_code=status.HTTP_201_CREATED)
def mark_attendance(
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    try:
        return create_attendance(
            db,
            attendance_data,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get("")
def list_attendance(
    page: int = Query(
        default=1,
        ge=1,
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
    employee_id: int | None = None,
    attendance_date: date | None = None,
    attendance_status: str | None = Query(
        default=None,
        alias="status",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    records, total = get_attendance_records(
        db=db,
        page=page,
        limit=limit,
        employee_id=employee_id,
        attendance_date=attendance_date,
        attendance_status=attendance_status,
    )

    return {
        "data": records,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (
            (total + limit - 1) // limit
            if total
            else 0
        ),
    }

@router.get("/summary")
def attendance_summary(
    employee_id: int | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_attendance_summary(
        db=db,
        employee_id=employee_id,
        start_date=start_date,
        end_date=end_date,
    )


@router.get("/{attendance_id}",response_model=AttendanceResponse,)
def get_attendance_by_id(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    attendance = get_attendance(
        db,
        attendance_id,
    )

    if attendance is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found",
        )

    return attendance

@router.put("/{attendance_id}",response_model=AttendanceResponse)
def update_attendance_endpoint(
    attendance_id: int,
    attendance_data: AttendanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    try:
        return update_attendance(
            db=db,
            attendance_id=attendance_id,
            attendance_data=attendance_data,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

@router.delete("/{attendance_id}")
def delete_attendance_endpoint(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    try:
        return delete_attendance(
            db=db,
            attendance_id=attendance_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )