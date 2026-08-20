import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function AttendanceSummary() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);

  const [employeeId, setEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  const [error, setError] = useState("");


  // ==================================================
  // Fetch Employees
  // ==================================================

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);

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
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Failed to load employees."
      );

    } finally {
      setLoadingEmployees(false);
    }
  };


  // ==================================================
  // Fetch Summary
  // ==================================================

  const fetchSummary = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "/api/attendance/summary",
        {
          params: {
            employee_id:
              employeeId || undefined,

            start_date:
              startDate || undefined,

            end_date:
              endDate || undefined,
          },
        }
      );

      setSummary(response.data);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Failed to load attendance summary."
      );

      setSummary(null);

    } finally {
      setLoading(false);
    }
  };


  // ==================================================
  // Initial Load
  // ==================================================

  useEffect(() => {
    fetchEmployees();
    fetchSummary();
  }, []);


  // ==================================================
  // Generate Summary
  // ==================================================

  const handleGenerate = () => {
    fetchSummary();
  };


  return (
    <div className="max-w-[1600px] mx-auto">

      {/* ================================================== */}
      {/* Header */}
      {/* ================================================== */}

      <div className="mb-8">

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-slate-900">
          Attendance Summary
        </h1>

        <p className="mt-1 text-slate-500">
          View employee attendance statistics.
        </p>

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
      {/* Filters */}
      {/* ================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <h2 className="mb-5 text-lg font-semibold text-slate-800">
          Filters
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          {/* Employee */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-600">
              Employee
            </label>

            <select
              value={employeeId}
              onChange={(event) =>
                setEmployeeId(event.target.value)
              }
              disabled={loadingEmployees}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            >

              <option value="">
                All Employees
              </option>

              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.name} —{" "}
                  {employee.employee_id}
                </option>
              ))}

            </select>

          </div>


          {/* Start Date */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-600">
              From Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(event) =>
                setStartDate(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

          </div>


          {/* End Date */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-600">
              To Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(event) =>
                setEndDate(event.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

          </div>


          {/* Button */}

          <div className="flex items-end">

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Loading..."
                : "Generate Summary"}
            </button>

          </div>

        </div>

      </div>


      {/* ================================================== */}
      {/* Summary Cards */}
      {/* ================================================== */}

      {loading ? (

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <p className="text-slate-500">
            Loading attendance summary...
          </p>

        </div>

      ) : summary ? (

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">

          {/* Total */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Total Records
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {summary.total ?? 0}
            </p>

          </div>


          {/* Present */}

          <div className="rounded-2xl border border-green-100 bg-green-50 p-6 shadow-sm">

            <p className="text-sm font-medium text-green-700">
              Present
            </p>

            <p className="mt-3 text-3xl font-bold text-green-800">
              {summary.present ?? 0}
            </p>

          </div>


          {/* Absent */}

          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm">

            <p className="text-sm font-medium text-red-700">
              Absent
            </p>

            <p className="mt-3 text-3xl font-bold text-red-800">
              {summary.absent ?? 0}
            </p>

          </div>


          {/* Half Day */}

          <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-6 shadow-sm">

            <p className="text-sm font-medium text-yellow-700">
              Half Day
            </p>

            <p className="mt-3 text-3xl font-bold text-yellow-800">
              {summary.half_day ?? 0}
            </p>

          </div>


          {/* Leave */}

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">

            <p className="text-sm font-medium text-blue-700">
              Leave
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-800">
              {summary.leave ?? 0}
            </p>

          </div>

        </div>

      ) : (

        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <p className="text-slate-500">
            No summary data available.
          </p>

        </div>

      )}

    </div>
  );
}

export default AttendanceSummary;