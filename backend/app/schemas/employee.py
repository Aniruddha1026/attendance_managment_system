from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Literal

class EmployeeBase(BaseModel):
    employee_id: str = Field(min_length=2, max_length=15)
    name: str = Field(min_length=2,max_length=30)
    email: EmailStr
    mobile_number: str = Field(min_length=10, max_length=15)
    department: str = Field(min_length=2, max_length=30)
    designation: str = Field(min_length=2, max_length=30)
    status: Literal["active", "inactive"] = "active"

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2,max_length=30)
    email: EmailStr | None = None
    mobile_number: str | None = Field(default=None, min_length=10, max_length=15)
    department: str | None = Field(default=None, min_length=2, max_length=30)
    designation: str | None = Field(default=None, min_length=2, max_length=30)
    status: Literal["active", "inactive"] = None

class EmployeeResponse(EmployeeBase):
    model_config=ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime