# Twitte AI – Attendance Management System

Twitte AI is a full-stack Employee Attendance Management System designed to manage employees, track attendance, and provide an overview of workforce attendance.

The application uses a React frontend, FastAPI backend, and PostgreSQL database, with JWT-based authentication and role-based access control.

---

## Features

### Authentication & Authorization
- JWT-based login
- Secure password hashing
- Role-based access control
- Admin and Viewer roles
- Active/inactive user accounts
- Protected API endpoints

### Employee Management
- Add employees
- View employee details
- Edit employee information
- Delete employees
- Search employees
- Filter employees by status
- Pagination
- Automatically generated employee IDs

### Attendance Management
- Mark employee attendance
- Edit attendance records
- Delete attendance records
- Filter by employee
- Filter by date
- Filter by attendance status
- Pagination

Supported attendance statuses:

- Present
- Absent
- Half Day
- Leave

### Dashboard
The dashboard provides:

- Total employees
- Active employees
- Present employees
- Absent employees
- Half-day employees
- Employees on leave
- Department-wise employee count

---

# Technology Stack

## Frontend

- React
- React Router
- Tailwind CSS
- Axios
- jwt-decode
- Vite

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT
- Passlib / password hashing
- Alembic

## Database

- PostgreSQL

---

# Project Structure

```text
attendance-management-system/
│
├── backend/
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
│   │   │   ├── user.py
│   │   │   ├── employee.py
│   │   │   └── attendance.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── employee.py
│   │   │   ├── attendance.py
│   │   │   └── dashboard.py
│   │   │
│   │   ├── services/
│   │   │   ├── employee_service.py
│   │   │   ├── attendance_service.py
│   │   │   └── dashboard_service.py
│   │   │
│   │   └── routers/
│   │       ├── auth.py
│   │       ├── employees.py
│   │       ├── attendance.py
│   │       └── dashboard.py
│   │
│   ├── alembic/
│   ├── .env
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── ...
│
└── README.md
````

---

# Prerequisites

Before running the project, install the following:

* Python 3.11+
* Node.js 18+
* PostgreSQL 14+
* Git
* npm

You can check the installed versions:

```bash
python --version
```

```bash
node --version
```

```bash
npm --version
```

```bash
psql --version
```

---

# 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project directory:

```bash
cd attendance-management-system
```

---

# 2. Setup PostgreSQL Database

Open PostgreSQL / psql and create a database:

```sql
CREATE DATABASE attendance_db;
```

Verify the database:

```sql
\l
```

Connect to it:

```sql
\c attendance_db
```

The application uses PostgreSQL through SQLAlchemy.

---

# 3. Backend Setup

Move into the backend directory:

```bash
cd backend
```

## Create a Virtual Environment

Windows:

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
python3 -m venv venv
```

```bash
source venv/bin/activate
```

---

# 4. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` has not been created yet, install the main dependencies:

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic python-jose passlib pydantic-settings email-validator
```

---

# 5. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
DATABASE_URL=postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/attendance_db

SECRET_KEY=your-super-secret-key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Important

Replace:

```text
YOUR_PASSWORD
```

with the password of your PostgreSQL user.

Do not commit `.env` to GitHub.

Add this to `.gitignore`:

```gitignore
.env
venv/
__pycache__/
```

---

# 6. Run Database Migrations

From the `backend` directory:

```bash
alembic upgrade head
```

This creates the required database tables.

You should have tables similar to:

```text
users
employees
attendance
alembic_version
```

---

# 7. Create the First Admin User

The application needs an initial admin account because users are authenticated through the `users` table.

You can create the first admin user using a database script or a dedicated initialization script.

Example SQL structure:

```sql
INSERT INTO users
(username, password_hash, role, is_active)
VALUES
(
    'admin',
    '<HASHED_PASSWORD>',
    'admin',
    TRUE
);
```

### Important

Do **not** insert a plain-text password.

The `password_hash` column must contain a properly generated password hash.

For example, if your application uses bcrypt, generate the hash through your backend's password hashing functionality rather than manually entering the password.

After creating the admin:

```text
Username: admin
Password: <your chosen password>
Role: admin
```

Use these credentials to log into the application.

---

# 8. Start the FastAPI Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

# 9. Setup Frontend

Open another terminal.

Move to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

# 10. Configure Frontend API

The frontend should use the FastAPI backend URL.

For example, your Axios configuration can use:

```javascript
baseURL: "http://127.0.0.1:8000"
```

If you are using a Vite environment variable, create:

```text
frontend/.env
```

with:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Then configure Axios to use:

```javascript
baseURL: import.meta.env.VITE_API_URL
```

---

# 11. Start the React Frontend

From the `frontend` directory:

```bash
npm run dev
```

Vite will provide a URL similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# 12. Login

Open the frontend:

```text
http://localhost:5173
```

Login using the admin account created in the database.

Example:

```text
Username: admin
Password: ********
```

After successful authentication, the JWT access token is stored by the frontend.

The token contains information such as:

```json
{
    "sub": "1",
    "role": "admin"
}
```

---

# Role-Based Access Control

Attendify supports different user roles.

## Admin

Administrators can:

* View dashboard
* Manage employees
* Add employees
* Edit employees
* Delete employees
* Mark attendance
* Edit attendance
* Delete attendance
* View attendance summary
* Manage system data

## Viewer

Viewers are intended to have read-only access.

They can:

* View dashboard
* View employees
* View attendance
* View attendance summary

They should not be allowed to:

* Add employees
* Edit employees
* Delete employees
* Mark attendance
* Edit attendance
* Delete attendance

The backend enforces these permissions using dependencies such as:

```python
get_current_user()
```

and:

```python
require_admin()
```

---

# API Endpoints

## Authentication

```text
POST /api/auth/login
```

Used to authenticate users and obtain a JWT access token.

---

## Employees

```text
GET    /api/employees
POST   /api/employees
GET    /api/employees/{id}
PUT    /api/employees/{id}
DELETE /api/employees/{id}
```

---

## Attendance

```text
GET    /api/attendance
POST   /api/attendance
GET    /api/attendance/{id}
PUT    /api/attendance/{id}
DELETE /api/attendance/{id}
```

---

## Dashboard

```text
GET /api/dashboard
```

Returns:

```json
{
    "total_employees": 3,
    "active_employees": 3,
    "present_today": 1,
    "absent_today": 1,
    "half_day_today": 1,
    "leave_today": 0,
    "department_counts": []
}
```

---

# Authentication Flow

The authentication process works as follows:

```text
User
 │
 │ username + password
 ▼
React Login Page
 │
 │ POST /api/auth/login
 ▼
FastAPI
 │
 │ Verify username
 │ Verify password
 │ Check account status
 ▼
JWT Access Token
 │
 ▼
React AuthContext
 │
 │ Store token
 ▼
Protected API Requests
 │
 ▼
FastAPI get_current_user()
 │
 ▼
Check user role
 │
 ├── admin  → Full access
 │
 └── viewer → Read-only access
```

---

# Database Structure

## users

Stores application users.

Important fields:

```text
id
username
password_hash
role
is_active
created_at
updated_at
```

Example:

```text
1 | admin | <hashed-password> | admin | true
2 | manager | <hashed-password> | viewer | true
```

---

## employees

Stores employee information such as:

```text
id
employee_id
name
email
mobile_number
department
designation
status
```

---

## attendance

Stores attendance records:

```text
id
employee_id
attendance_date
checkin_time
checkout_time
status
```

Supported statuses:

```text
Present
Absent
Half Day
Leave
```

---

# Database Verification

To connect to PostgreSQL:

```bash
psql -U postgres -d attendance_db
```

View tables:

```sql
\dt
```

View users:

```sql
SELECT * FROM users;
```

View employees:

```sql
SELECT * FROM employees;
```

View attendance:

```sql
SELECT * FROM attendance;
```

---

# Troubleshooting

## PostgreSQL connection error

Check:

```env
DATABASE_URL=postgresql+psycopg2://postgres:PASSWORD@localhost:5432/attendance_db
```

Make sure:

* PostgreSQL is running
* Database exists
* Username is correct
* Password is correct
* Port is correct

Default PostgreSQL port:

```text
5432
```

---

## Alembic migration error

Make sure you are inside:

```text
backend/
```

Then run:

```bash
alembic upgrade head
```

---

## Frontend cannot connect to backend

Make sure FastAPI is running:

```bash
uvicorn app.main:app --reload
```

Check:

```text
http://127.0.0.1:8000/docs
```

Also verify the Axios `baseURL`.

---

## CORS error

Make sure your FastAPI application allows the frontend origin.

For local development:

```text
http://localhost:5173
```

---

## JWT authentication error

Make sure:

* The token is being stored correctly
* The Authorization header contains the token
* `SECRET_KEY` is the same across the application
* The JWT algorithm matches the configured algorithm

The request should contain:

```text
Authorization: Bearer <access_token>
```

---

# Development Commands

## Backend

Activate virtual environment:

```bash
venv\Scripts\activate
```

Start server:

```bash
uvicorn app.main:app --reload
```

Run migrations:

```bash
alembic upgrade head
```

Create a migration:

```bash
alembic revision --autogenerate -m "description"
```

---

## Frontend

Install packages:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# Security Notes

* Passwords are stored as hashes rather than plain text.
* JWT tokens are used for authentication.
* Protected endpoints require authentication.
* Admin-only endpoints use role-based authorization.
* `.env` files should not be committed to Git.
* The production `SECRET_KEY` should be long and randomly generated.
* Database credentials should never be hard-coded into source code.

---

# Future Improvements

Possible future enhancements include:

* User management interface
* Admin-created Viewer accounts
* Password reset functionality
* Email notifications
* Attendance reports
* CSV/Excel export
* Monthly attendance analytics
* Employee profile photos
* Audit logs
* Advanced role permissions
* Production deployment

---

# Author

Developed as a full-stack attendance management project using:

**React + FastAPI + PostgreSQL**

````

### One important thing before you submit this

Your current system **does not yet have a UI for creating users**. That's okay if you're using the SQL/database script to create the initial admin and viewer accounts.

For a demo/project submission, I'd recommend this flow:

```text
Database Script
      ↓
Create initial admin
      ↓
Admin logs in
      ↓
Admin manages employees + attendance
      ↓
Viewer accounts can be added through SQL
      ↓
Viewer logs in
      ↓
Viewer gets read-only access
````

