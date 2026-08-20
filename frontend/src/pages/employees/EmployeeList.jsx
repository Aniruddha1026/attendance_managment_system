import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function EmployeeList() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ---------------------------------------------
  // Role
  // ---------------------------------------------

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const totalPages = Math.ceil(total / limit);

  // ---------------------------------------------
  // Fetch Employees
  // ---------------------------------------------

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/employees", {
        params: {
          page,
          limit,
          search: search || undefined,
          status: statusFilter || undefined,
        },
      });

      setEmployees(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
          "Failed to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // Fetch whenever filters/page change
  // ---------------------------------------------

  useEffect(() => {
    fetchEmployees();
  }, [page, search, statusFilter]);

  // ---------------------------------------------
  // Delete Employee
  // ---------------------------------------------

  const handleDelete = async () => {
    if (!deleteEmployee || !isAdmin) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await api.delete(
        `/api/employees/${deleteEmployee.id}`
      );

      setDeleteEmployee(null);

      await fetchEmployees();
    } catch (error) {
      console.error(error);

      setDeleteEmployee(null);

      setError(
        error.response?.data?.detail ||
          "Failed to delete employee."
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
            Employees
          </h1>

          <p className="mt-1 text-slate-500">
            Manage your organization's employees.
          </p>
        </div>

        {/* Admin Only */}

        {isAdmin && (
          <button
            onClick={() => navigate("/employees/add")}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            + Add Employee
          </button>
        )}

      </div>

      {/* ================================================== */}
      {/* Viewer Notice */}
      {/* ================================================== */}

      {!isAdmin && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-700">
          You are logged in as a Viewer. You have read-only access to employee information.
        </div>
      )}

      {/* ================================================== */}
      {/* Filters */}
      {/* ================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Search */}

          <div className="md:col-span-2">

            <label className="block text-sm font-medium text-slate-600 mb-2">
              Search Employees
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Search by name, employee ID or email..."
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
                setStatusFilter(event.target.value);
              }}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white"
            >

              <option value="">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
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
      {/* Employee Table */}
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
                  Department
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Designation
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Contact
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
                    Loading employees...
                  </td>
                </tr>

              ) : employees.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center"
                  >

                    <div className="text-slate-400 text-4xl mb-3">
                      ◉
                    </div>

                    <p className="font-medium text-slate-600">
                      No employees found
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                employees.map((employee) => (

                  <tr
                    key={employee.id}
                    className="hover:bg-slate-50 transition"
                  >

                    {/* Employee */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">

                          {employee.name
                            ?.charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <p className="font-semibold text-slate-800">
                            {employee.name}
                          </p>

                          <p className="text-sm text-slate-400">
                            {employee.employee_id}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Department */}

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {employee.department}
                    </td>

                    {/* Designation */}

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {employee.designation}
                    </td>

                    {/* Contact */}

                    <td className="px-6 py-5">

                      <p className="text-sm text-slate-700">
                        {employee.email}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {employee.mobile_number}
                      </p>

                    </td>

                    {/* Status */}

                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          employee.status?.toLowerCase() === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {employee.status}
                      </span>

                    </td>

                    {/* Actions */}

                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        {/* View - Everyone */}

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/employees/${employee.id}`
                            )
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          View
                        </button>

                        {/* Admin Only */}

                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/employees/${employee.id}/edit`
                                )
                              }
                              className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteEmployee(employee)
                              }
                              className="rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </>
                        )}

                      </div>

                    </td>

                  </tr>

                ))

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
              {employees.length}
            </span>{" "}

            of{" "}

            <span className="font-medium text-slate-700">
              {total}
            </span>{" "}

            employees

          </p>

          <div className="flex items-center gap-2">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage((current) => current - 1)
              }
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-3 text-sm text-slate-500">
              Page {page} of {totalPages || 1}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* Delete Modal - Admin Only */}
      {/* ================================================== */}

      {deleteEmployee && isAdmin && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            <div className="p-6">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-lg font-bold text-red-600">
                  !
                </div>

                <div>

                  <h2 className="text-lg font-semibold text-slate-900">
                    Delete Employee?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">

                    Are you sure you want to permanently
                    delete{" "}

                    <span className="font-semibold text-slate-700">
                      {deleteEmployee.name}
                    </span>
                    ?

                  </p>

                </div>

              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-xs text-slate-400">
                      Employee ID
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {deleteEmployee.employee_id}
                    </p>

                  </div>

                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                    Permanent
                  </span>

                </div>

              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">

                If this employee has attendance records,
                they cannot be permanently deleted.
                You can set their status to Inactive instead.

              </p>

            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setDeleteEmployee(null)
                }
                disabled={deleting}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Employee"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default EmployeeList;