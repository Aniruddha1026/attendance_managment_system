import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    email: "",
    mobile_number: "",
    department: "",
    designation: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  /* Load employee */
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(
          `/api/employees/${id}`
        );

        setFormData({
          employee_id: response.data.employee_id || "",
          name: response.data.name || "",
          email: response.data.email || "",
          mobile_number:
            response.data.mobile_number || "",
          department:
            response.data.department || "",
          designation:
            response.data.designation || "",
          status:
            response.data.status || "Active",
        });

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


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      /*
       * Employee ID is intentionally excluded.
       * It should not change after creation.
       */

      const updateData = {
        name: formData.name,
        email: formData.email,
        mobile_number: formData.mobile_number,
        department: formData.department,
        designation: formData.designation,
        status: formData.status,
      };

      await api.put(
        `/api/employees/${id}`,
        updateData
      );

      navigate(`/employees/${id}`);

    } catch (error) {
      console.error(error);

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail
            .map((item) => item.msg)
            .join(", ")
        );
      } else {
        setError(
          detail ||
          "Failed to update employee."
        );
      }

    } finally {
      setSaving(false);
    }
  };


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


  return (
    <div className="mx-auto w-full max-w-5xl">

      {/* Header */}
      <div className="mb-7">

        <button
          type="button"
          onClick={() =>
            navigate(`/employees/${id}`)
          }
          className="mb-4 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          ← Back to Employee
        </button>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Edit Employee
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update employee information.
        </p>

      </div>


      <form onSubmit={handleSubmit}>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Section header */}
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">

            <h2 className="font-semibold text-slate-900">
              Employee Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Employee ID cannot be changed after creation.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-8">

            {/* Employee ID - READ ONLY */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Employee ID
              </label>

              <input
                type="text"
                value={formData.employee_id}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Employee ID is permanent.
              </p>

            </div>


            {/* Name */}
            <InputField
              label="Employee Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />


            {/* Email */}
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />


            {/* Mobile */}
            <InputField
              label="Mobile Number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
            />


            {/* Department */}
            <InputField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />


            {/* Designation */}
            <InputField
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />


            {/* Status */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>


          {/* Error */}
          {error && (
            <div className="px-6 pb-4 sm:px-8">

              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>

            </div>
          )}


          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">

            <button
              type="button"
              onClick={() =>
                navigate(`/employees/${id}`)
              }
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </div>

      </form>

    </div>
  );
}


/* -------------------------------- */
/* Input Component                  */
/* -------------------------------- */

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) {
  return (
    <div>

      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />

    </div>
  );
}


export default EditEmployee;