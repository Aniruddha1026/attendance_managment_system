import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function AddEmployee() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    email: "",
    mobile_number: "",
    department: "",
    designation: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post(
        "/api/employees",
        formData
      );

      setSuccess("Employee created successfully.");

      setTimeout(() => {
        navigate("/employees");
      }, 800);

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
          "Failed to create employee."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="mx-auto w-full max-w-5xl">

      {/* Header */}
      <div className="mb-7">

        <button
          type="button"
          onClick={() => navigate("/employees")}
          className="mb-4 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          ← Back to Employees
        </button>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Add Employee
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Add a new employee to your organization.
        </p>

      </div>


      {/* Form */}
      <form onSubmit={handleSubmit}>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Employee Information */}
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">

            <h2 className="font-semibold text-slate-900">
              Employee Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the employee's basic information.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-8">

            {/* Employee ID */}
            <InputField
              label="Employee ID"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              placeholder="e.g. EMP001"
              required
              helpText="Enter a unique employee ID."
            />


            {/* Employee Name */}
            <InputField
              label="Employee Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
            />


            {/* Email */}
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />


            {/* Mobile */}
            <InputField
              label="Mobile Number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              required
            />


            {/* Department */}
            <InputField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. IT"
              required
            />


            {/* Designation */}
            <InputField
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
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

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>


          {/* Messages */}
          {(error || success) && (
            <div className="px-6 pb-4 sm:px-8">

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                  {success}
                </div>
              )}

            </div>
          )}


          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">

            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating..."
                : "Create Employee"}
            </button>

          </div>

        </div>

      </form>

    </div>
  );
}


/* -------------------------------- */
/* Reusable Input Component          */
/* -------------------------------- */

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  helpText,
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
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />


      {helpText && (
        <p className="mt-1.5 text-xs text-slate-400">
          {helpText}
        </p>
      )}

    </div>
  );
}


export default AddEmployee;