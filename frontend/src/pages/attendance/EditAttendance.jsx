import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function EditAttendance() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    employee_id: "",
    attendance_date: "",
    checkin_time: "",
    checkout_time: "",
    status: "Present",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ==================================================
  // Fetch Employees
  // ==================================================

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
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Failed to load employees."
      );
    }
  };


  // ==================================================
  // Fetch Attendance Record
  // ==================================================

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/api/attendance/${id}`
      );

      const record = response.data;

      setFormData({
        employee_id: record.employee_id || "",
        attendance_date:
          record.attendance_date || "",
        checkin_time:
          record.checkin_time || "",
        checkout_time:
          record.checkout_time || "",
        status:
          record.status || "Present",
      });

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Failed to load attendance record."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==================================================
  // Initial Load
  // ==================================================

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [id]);


  // ==================================================
  // Handle Input Changes
  // ==================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };


  // ==================================================
  // Update Attendance
  // ==================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        employee_id: Number(
          formData.employee_id
        ),

        attendance_date:
          formData.attendance_date,

        checkin_time:
          formData.checkin_time || null,

        checkout_time:
          formData.checkout_time || null,

        status:
          formData.status,
      };

      await api.put(
        `/api/attendance/${id}`,
        payload
      );

      setSuccess(
        "Attendance updated successfully."
      );

      setTimeout(() => {
        navigate("/attendance");
      }, 800);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Failed to update attendance."
      );

    } finally {
      setSaving(false);
    }
  };


  // ==================================================
  // Loading
  // ==================================================

  if (loading) {
    return (
      <div className="max-w-[1000px] mx-auto">

        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <p className="text-slate-500">
            Loading attendance record...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="max-w-[1000px] mx-auto">

      {/* ================================================== */}
      {/* Header */}
      {/* ================================================== */}

      <div className="mb-8">

        <button
          type="button"
          onClick={() =>
            navigate("/attendance")
          }
          className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Attendance
        </button>

        <h1 className="text-3xl font-bold text-slate-900">
          Edit Attendance
        </h1>

        <p className="mt-1 text-slate-500">
          Update the attendance record.
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
      {/* Success */}
      {/* ================================================== */}

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
          {success}
        </div>
      )}


      {/* ================================================== */}
      {/* Form */}
      {/* ================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Employee */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-600">
              Employee
            </label>

            <select
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            >

              <option value="">
                Select Employee
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


          {/* Date */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-600">
              Attendance Date
            </label>

            <input
              type="date"
              name="attendance_date"
              value={formData.attendance_date}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

          </div>


          {/* Check In / Check Out */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-600">
                Check-In Time
              </label>

              <input
                type="time"
                name="checkin_time"
                value={formData.checkin_time}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

            </div>


            <div>

              <label className="mb-2 block text-sm font-medium text-slate-600">
                Check-Out Time
              </label>

              <input
                type="time"
                name="checkout_time"
                value={formData.checkout_time}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

            </div>

          </div>


          {/* Status */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-600">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            >

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


          {/* Buttons */}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">

            <button
              type="button"
              onClick={() =>
                navigate("/attendance")
              }
              disabled={saving}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Updating..."
                : "Update Attendance"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditAttendance;