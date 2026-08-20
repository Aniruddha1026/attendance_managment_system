import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(
          `/api/employees/${id}`
        );

        setEmployee(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.detail ||
          "Failed to load employee."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);


  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          Loading employee...
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="mx-auto w-full max-w-5xl">

        <button
          onClick={() => navigate("/employees")}
          className="mb-5 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          ← Back to Employees
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>

      </div>
    );
  }


  if (!employee) {
    return null;
  }


  return (
    <div className="mx-auto w-full max-w-5xl">

      {/* Header */}
      <div className="mb-7">

        <button
          onClick={() => navigate("/employees")}
          className="mb-4 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          ← Back to Employees
        </button>


        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-bold text-blue-600">
              {employee.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {employee.name}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {employee.employee_id}
              </p>

            </div>

          </div>


          <button
            onClick={() =>
              navigate(
                `/employees/${employee.id}/edit`
              )
            }
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Edit Employee
          </button>

        </div>

      </div>


      {/* Employee information */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-6 py-5 sm:px-8">

          <h2 className="font-semibold text-slate-900">
            Employee Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Details associated with this employee.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 sm:grid-cols-2 sm:p-8">

          <DetailItem
            label="Employee ID"
            value={employee.employee_id}
          />

          <DetailItem
            label="Status"
            value={employee.status}
            status
          />

          <DetailItem
            label="Full Name"
            value={employee.name}
          />

          <DetailItem
            label="Email Address"
            value={employee.email}
          />

          <DetailItem
            label="Mobile Number"
            value={employee.mobile_number}
          />

          <DetailItem
            label="Department"
            value={employee.department}
          />

          <DetailItem
            label="Designation"
            value={employee.designation}
          />

          <DetailItem
            label="Created At"
            value={
              employee.created_at
                ? new Date(
                    employee.created_at
                  ).toLocaleString("en-IN")
                : "—"
            }
          />

        </div>

      </div>


      {/* Attendance placeholder */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-6 py-5 sm:px-8">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="font-semibold text-slate-900">
                Attendance History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Attendance records for this employee.
              </p>

            </div>

            <button
              onClick={() =>
                navigate(
                  `/attendance?employee_id=${employee.id}`
                )
              }
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Attendance →
            </button>

          </div>

        </div>


        <div className="p-8 text-center">

          <p className="text-sm text-slate-400">
            Attendance history will appear here.
          </p>

        </div>

      </div>

    </div>
  );
}


/* -------------------------------- */
/* Detail Component                 */
/* -------------------------------- */

function DetailItem({
  label,
  value,
  status = false,
}) {
  return (
    <div>

      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>


      {status ? (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            value === "Active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {value}
        </span>
      ) : (
        <p className="text-sm font-medium text-slate-800">
          {value || "—"}
        </p>
      )}

    </div>
  );
}


export default EmployeeDetails;