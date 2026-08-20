import { useState } from "react";
import api from "../../services/api";

function UserManagement() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/api/users", {
        username,
        password,
        role,
      });

      setMessage("User created successfully.");

      setUsername("");
      setPassword("");
      setRole("viewer");

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to create user."
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">

      <h1 className="text-3xl font-bold text-slate-900">
        User Management
      </h1>

      <p className="mt-1 text-slate-500">
        Create accounts for administrators and viewers.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        {message && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Username
            </label>

            <input
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              minLength={8}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="viewer">
                Viewer
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Create User
          </button>

        </form>

      </div>

    </div>
  );
}

export default UserManagement;