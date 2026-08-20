# Twitte AI – Attendance Management System

Twitte AI is a full-stack Employee Attendance Management System designed to manage employees, track attendance, and provide workforce statistics through a centralized dashboard.

The application includes JWT-based authentication and role-based access control with **Admin** and **Viewer** roles.

---

## Features

### Authentication

- JWT-based authentication
- Secure password hashing
- Login functionality
- Token-based API authorization
- Active/inactive user accounts
- Role-based access control

### Role-Based Access

#### Admin

Administrators can:

- View the dashboard
- Add employees
- View employees
- Edit employees
- Delete employees
- Mark attendance
- Edit attendance
- Delete attendance records
- View attendance summaries
- Create and manage application users
- Assign `Admin` or `Viewer` roles

#### Viewer

Viewers can:

- Access the dashboard
- View employees
- View attendance records
- View attendance summaries

Viewers do not have administrative privileges such as creating users or modifying protected resources.

---

## Dashboard

The dashboard provides an overview of the workforce, including:

- Total employees
- Active employees
- Employees present today
- Employees absent today
- Half-day employees
- Employees on leave
- Attendance percentage
- Employees by department
- Attendance summary

---

## Employee Management

The employee module supports:

- Creating employees
- Automatically generated employee database IDs
- Employee IDs
- Searching employees
- Filtering by employee status
- Viewing employee details
- Editing employee information
- Deleting employees
- Pagination

---

## Attendance Management

Attendance records support the following statuses:

- Present
- Absent
- Half Day
- Leave

The attendance module supports:

- Marking attendance
- Editing attendance
- Deleting attendance
- Filtering by employee
- Filtering by date
- Filtering by attendance status
- Pagination
- Attendance summary

---

## Technology Stack

### Frontend

- React
- React Router
- Tailwind CSS
- Axios
- jwt-decode
- Vite

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT
- Passlib / bcrypt
- Alembic

### Database

- PostgreSQL

### Development Tools

- VS Code
- Git
- Postman
- Swagger / OpenAPI

---

## Project Structure

```text
attendance-management-system/
│
├── backend/
│   │
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── dependencies.py
│   │   │   └── security.py
│   │   │
│   │   ├── database/
│   │   │   ├── base.py
│   │   │   └── connection.py
│   │   │
│   │   ├── models/
│   │   │   ├── employee.py
│   │   │   ├── attendance.py
│   │   │   └── user.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── employee.py
│   │   │   ├── attendance.py
│   │   │   ├── auth.py
│   │   │   └── dashboard.py
│   │   │
│   │   ├── routers/
│   │   │   ├── employees.py
│   │   │   ├── attendance.py
│   │   │   ├── auth.py
│   │   │   ├── dashboard.py
│   │   │   └── users.py
│   │   │
│   │   ├── services/
│   │   │   ├── employee_service.py
│   │   │   ├── attendance_service.py
│   │   │   ├── dashboard_service.py
│   │   │   └── user_service.py
│   │   │
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── .env
│   ├── requirements.txt
│   └── create_admin.sql
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── auth/
│   │   │   │   └── Login.jsx
│   │   │   ├── employees/
│   │   │   ├── attendance/
│   │   │   └── users/
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md