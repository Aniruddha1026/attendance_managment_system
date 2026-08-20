import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/employees/EmployeeList";
import AddEmployee from "./pages/employees/AddEmployee";
import EmployeeDetails from "./pages/employees/EmployeeDetails";
import EditEmployee from "./pages/employees/EditEmployee";
import AttendanceList from "./pages/attendance/AttendanceList";
import MarkAttendance from "./pages/attendance/MarkAttendance";
import EditAttendance from "./pages/attendance/EditAttendance";
import AttendanceSummary from "./pages/attendance/AttendanceSummary";
import UserManagement from "./pages/users/UserManagement";


function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          {/* Public */}
          <Route
            path="/login"
            element={<Login />}
          />


          {/* Protected */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

          </Route>


          {/* Fallback */}
          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/employees"
            element={<EmployeeList />}
          />

          <Route
            path="/employees/add"
            element={<AddEmployee />}
          />

          <Route
            path="/employees/:id/edit"
            element={<EditEmployee />}
          />

          

          <Route
            path="/employees/:id"
            element={<EmployeeDetails />}
          />

          <Route
            path="/attendance"
            element={<AttendanceList />}
          />

          <Route
            path="/attendance/mark"
            element={<MarkAttendance />}
          />

          <Route
            path="/attendance/:id/edit"
            element={<EditAttendance />}
          />

          <Route
            path="/attendance/summary"
            element={<AttendanceSummary />}
          />

          <Route
            path="/users"
            element={<UserManagement />}
          />


        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;