import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(username, password);

      navigate("/dashboard");

    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Invalid username or password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex">

      {/* Left branding section */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/30 via-slate-900 to-slate-950" />

        <div className="relative z-10 flex flex-col justify-between w-full p-16">

          <div>
            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-xl font-bold">
                T
              </div>

              <span className="text-2xl font-bold">
                Twiite AI
              </span>

            </div>
          </div>

          <div className="max-w-xl">

            <p className="text-blue-400 font-semibold uppercase tracking-wider text-sm mb-4">
              Attendance Management
            </p>

            <h1 className="text-5xl font-bold leading-tight">
              Manage your workforce
              <span className="text-blue-500">
                {" "}with confidence.
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              Track employee attendance, manage your workforce,
              and get a clear overview of your organization from
              one centralized dashboard.
            </p>

          </div>

          <p className="text-sm text-slate-500">
            © 2026 Twitte AI. All rights reserved.
          </p>

        </div>
      </div>


      {/* Login section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">

        <div className="w-full max-w-lg">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">

            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
              T
            </div>

            <span className="text-2xl font-bold text-slate-900">
              Twitte AI
            </span>

          </div>


          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-10">

            <div className="mb-8">

              <h2 className="text-3xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-slate-500">
                Sign in to access your attendance dashboard.
              </p>

            </div>


            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}


            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  required
                  placeholder="Enter your username"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;