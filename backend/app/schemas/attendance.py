from datetime import date, time, datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

AttendanceStatus= Literal[
    "Present",
    "Absent",
    "Half Day",
    "Leave"
]

class AttendanceCreate(BaseModel):
    employee_id: int

    attendance_date: date

    checkin_time: time | None = None

    checkout_time: time | None = None

    status: AttendanceStatus

class AttendanceUpdate(BaseModel):
    attendance_date: date
    checkin_time: time | None = None
    checkout_time: time | None = None
    status: AttendanceStatus

class AttendanceSummaryResponse(BaseModel):
    total_records: int
    present: int
    absent: int
    half_day: int
    leave: int


class AttendanceResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    employee_id: int
    attendance_date: date
    checkin_time: time | None
    checkout_time: time | None
    status: AttendanceStatus
    created_at: datetime
    updated_at: datetime

