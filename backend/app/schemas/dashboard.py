from pydantic import BaseModel


class DepartmentCount(BaseModel):
    department: str
    employee_count: int


class DashboardResponse(BaseModel):
    total_employees: int
    active_employees: int
    present_today: int
    absent_today: int
    half_day_today: int
    leave_today: int
    department_counts: list[DepartmentCount]