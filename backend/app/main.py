from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as auth_router
from app.routers.employees import router as employees_router
from app.routers.attendance import router as attendance_router
from app.routers.dashboard import router as dashboard_router
from app.routers.users import router as users_router

app=FastAPI(
    title="Attendance Management System",
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(employees_router)
app.include_router(attendance_router)
app.include_router(dashboard_router)
app.include_router(users_router)

@app.get("/")
def root():
    return { "message": "Attendance System is running"}
