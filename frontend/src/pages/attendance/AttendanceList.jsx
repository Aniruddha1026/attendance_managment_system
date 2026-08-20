import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function AttendanceList() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);

  const [employeeId, setEmployeeId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteRecord, setDeleteRecord] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [employees, setEmployees] = useState([]);

  // ---------------------------------------------
  // Role
  // ---------------------------------------------

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  // ---------------------------------------------
  // Fetch Employees
  // ---------------------------------------------

  const fetchEmployees = async () => {
    try {
      const response = await api.get(
        "/api/employees",
        {
          params: {
            page: 1,
            limit: 100,
          },
        }
      );

      setEmployees(response.data.data);

    } catch (error) {
      console.error(
        "Failed to load employees:",
        error
      );
    }
  };

  // ---------------------------------------------
  // Find Employee
  // ---------------------------------------------

  const getEmployee = (employeeDatabaseId) => {
    return employees.find(
      (employee) =>
        employee.id === employeeDatabaseId
    );
  };

  // ---------------------------------------------
  // Fetch Attendance
  // ---------------------------------------------

  const fetchAttendance = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "/api/attendance",
        {
          params: {
            page,
            limit,
            employee_id:
              employeeId || undefined,
            attendance_date:
              attendanceDate || undefined,
            status:
              statusFilter || undefined,
          },
        }
      );

      setRecords(response.data.data);
      setTotal(response.data.total);

      setTotalPages(
        response.data.total_pages
      );

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
          "Failed to load attendance records."
      );

    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // Initial Employee Fetch
  // ---------------------------------------------

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ---------------------------------------------
  // Attendance Fetch
  // ---------------------------------------------

  useEffect(() => {
    fetchAttendance();
  }, [
    page,
    employeeId,
    attendanceDate,
    statusFilter,
  ]);

  // ---------------------------------------------
  // Delete Attendance
  // ---------------------------------------------

  const handleDelete = async () => {
    if (!deleteRecord || !isAdmin) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await api.delete(
        `/api/attendance/${deleteRecord.id}`
      );

      setDeleteRecord(null);

      await fetchAttendance();

    } catch (error) {
      console.error(error);

      setDeleteRecord(null);

      setError(
        error.response?.data?.detail ||
          "Failed to delete attendance record."
      );

    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto">

      {/* ================================================== */}
      {/* Header */}
      {/* ================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition"
        >
          ← Back to Dashboard
        </button>

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Attendance
          </h1>

          <p className="mt-1 text-slate-500">
            Manage and monitor employee attendance.
          </p>

        </div>

        {/* Admin Only */}

        {isAdmin && (
          <button
            onClick={() =>
              navigate("/attendance/mark")
            }
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            + Mark Attendance
          </button>
        )}

      </div>

      {/* ================================================== */}
      {/* Viewer Notice */}
      {/* ================================================== */}

      {!isAdmin && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-700">
          You are logged in as a Viewer. Attendance information is read-only.
        </div>
      )}

      {/* ================================================== */}
      {/* Summary Button */}
      {/* ================================================== */}

      <div className="mb-6">

        <button
          type="button"
          onClick={() =>
            navigate("/attendance/summary")
          }
          className="rounded-xl border border-blue-200 bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          View Summary
        </button>

      </div>

      {/* ================================================== */}
      {/* Filters */}
      {/* ================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Employee ID */}

          <div>

            <label className="block text-sm font-medium text-slate-600 mb-2">
              Employee ID
            </label>

            <input
              type="text"
              value={employeeId}
              onChange={(event) => {
                setPage(1);
                setEmployeeId(
                  event.target.value
                );
              }}
              placeholder="e.g. 1"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

          </div>

          {/* Date */}

          <div>

            <label className="block text-sm font-medium text-slate-600 mb-2">
              Attendance Date
            </label>

            <input
              type="date"
              value={attendanceDate}
              onChange={(event) => {
                setPage(1);
                setAttendanceDate(
                  event.target.value
                );
              }}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

          </div>

          {/* Status */}

          <div>

            <label className="block text-sm font-medium text-slate-600 mb-2">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) => {
                setPage(1);
                setStatusFilter(
                  event.target.value
                );
              }}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
            >

              <option value="">
                All Status
              </option>

              <option value="Present">
                Present
              </option>

              <option value="Absent">
                Absent
              </option>

              <option value="Half Day">
                Half Day
              </option>

              <option value="Leave">
                Leave
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* Error */}
      {/* ================================================== */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
          {error}
        </div>
      )}

      {/* ================================================== */}
      {/* Attendance Table */}
      {/* ================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Employee
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Check-In
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Check-Out
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center text-slate-500"
                  >
                    Loading attendance records...
                  </td>

                </tr>

              ) : records.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center"
                  >

                    <div className="text-slate-400 text-4xl mb-3">
                      ◷
                    </div>

                    <p className="font-medium text-slate-600">
                      No attendance records found
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Try changing your filters.
                    </p>

                  </td>

                </tr>

              ) : (

                records.map((record) => {

                  const employee = getEmployee(
                    record.employee_id
                  );

                  return (

                    <tr
                      key={record.id}
                      className="hover:bg-slate-50 transition"
                    >

                      {/* Employee */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold shrink-0">

                            {employee?.name
                              ?.charAt(0)
                              .toUpperCase() || "?"}

                          </div>

                          <div className="min-w-0">

                            <p className="font-semibold text-slate-800 truncate">

                              {employee?.name ||
                                `Employee #${record.employee_id}`}

                            </p>

                            <p className="text-sm text-slate-400">

                              {employee?.employee_id ||
                                "Unknown ID"}

                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Date */}

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {record.attendance_date}
                      </td>

                      {/* Check-In */}

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {record.checkin_time || "—"}
                      </td>

                      {/* Check-Out */}

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {record.checkout_time || "—"}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            record.status === "Present"
                              ? "bg-green-50 text-green-700"
                              : record.status === "Absent"
                              ? "bg-red-50 text-red-700"
                              : record.status === "Half Day"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {record.status}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          {/* Admin Only */}

                          {isAdmin && (
                            <>

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/attendance/${record.id}/edit`
                                  )
                                }
                                className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteRecord(record)
                                }
                                className="rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>

                            </>
                          )}

                          {/* Viewer */}

                          {!isAdmin && (
                            <span className="text-xs text-slate-400 py-2">
                              View only
                            </span>
                          )}

                        </div>

                      </td>

                    </tr>

                  );

                })

              )}

            </tbody>

          </table>

        </div>

        {/* ================================================== */}
        {/* Pagination */}
        {/* ================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-200 px-6 py-4">

          <p className="text-sm text-slate-500">

            Showing{" "}

            <span className="font-medium text-slate-700">
              {records.length}
            </span>{" "}

            of{" "}

            <span className="font-medium text-slate-700">
              {total}
            </span>{" "}

            records

          </p>

          <div className="flex items-center gap-2">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage(
                  (current) =>
                    current - 1
                )
              }
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-3 text-sm text-slate-500">
              Page {page} of{" "}
              {totalPages || 1}
            </span>

            <button
              disabled={
                page >= totalPages
              }
              onClick={() =>
                setPage(
                  (current) =>
                    current + 1
                )
              }
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* Delete Confirmation Modal - Admin Only */}
      {/* ================================================== */}

      {deleteRecord && isAdmin && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            <div className="p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-lg font-bold text-red-600">
                  !
                </div>

                <div>

                  <h2 className="text-lg font-semibold text-slate-900">
                    Delete Attendance?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Are you sure you want to permanently
                    delete this attendance record?
                  </p>

                </div>

              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">

                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <p className="text-xs text-slate-400">
                      Employee
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">

                      {getEmployee(
                        deleteRecord.employee_id
                      )?.name ||
                        `Employee #${deleteRecord.employee_id}`}

                    </p>

                    <p className="text-xs text-slate-400 mt-1">

                      {getEmployee(
                        deleteRecord.employee_id
                      )?.employee_id ||
                        "Unknown ID"}

                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-slate-400">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {deleteRecord.attendance_date}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setDeleteRecord(null)
                }
                disabled={deleting}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {deleting
                  ? "Deleting..."
                  : "Delete Attendance"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AttendanceList;