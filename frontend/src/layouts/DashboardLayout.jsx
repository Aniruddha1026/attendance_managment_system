import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const { user, role, logout } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "▦",
    },
    {
      name: "Employees",
      path: "/employees",
      icon: "◉",
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: "✓",
    },

    // Only admins can see User Management
    ...(role === "admin"
      ? [
          {
            name: "Users",
            path: "/users",
            icon: "👤",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen w-full bg-slate-100 flex">

      {/* ================================================== */}
      {/* Sidebar */}
      {/* ================================================== */}

      <aside className="hidden md:flex w-[250px] shrink-0 flex-col bg-slate-950 text-white">

        {/* ================================================== */}
        {/* Logo */}
        {/* ================================================== */}

        <div className="h-20 flex items-center px-6 border-b border-slate-800">

          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg">
            T
          </div>

          <div className="ml-3">

            <h1 className="font-bold text-lg">
              Twitte AI
            </h1>

            <p className="text-xs text-slate-500">
              {role === "admin"
                ? "Admin Portal"
                : "Viewer Portal"}
            </p>

          </div>

        </div>


        {/* ================================================== */}
        {/* Navigation */}
        {/* ================================================== */}

        <nav className="flex-1 px-4 py-6">

          <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          <div className="space-y-2">

            {navItems.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >

                <span className="text-lg w-5 text-center">
                  {item.icon}
                </span>

                {item.name}

              </NavLink>

            ))}

          </div>

        </nav>


        {/* ================================================== */}
        {/* User Section */}
        {/* ================================================== */}

        <div className="border-t border-slate-800 p-4">

          <div className="flex items-center gap-3 px-2 py-3">

            {/* Avatar */}

            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold">

              {user
                ? user.charAt(0).toUpperCase()
                : "U"}

            </div>


            {/* User Information */}

            <div className="flex-1 min-w-0">

              <p className="text-sm font-semibold truncate">
                {user || "User"}
              </p>

              <p className="text-xs text-slate-500 capitalize">
                {role || "user"}
              </p>

            </div>

          </div>


          {/* Logout */}

          <button
            onClick={logout}
            className="w-full mt-2 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-900 hover:text-white transition text-left"
          >
            Sign out
          </button>

        </div>

      </aside>


      {/* ================================================== */}
      {/* Main Area */}
      {/* ================================================== */}

      <div className="flex-1 min-w-0 flex flex-col">


        {/* ================================================== */}
        {/* Top Bar */}
        {/* ================================================== */}

        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0">

          {/* Welcome */}

          <div>

            <p className="text-sm text-slate-500">
              Welcome back,
            </p>

            <p className="font-semibold text-slate-800">
              {user || "User"}
            </p>

          </div>


          {/* System Status */}

          <div className="flex items-center gap-4">

            <div className="hidden sm:block text-right">

              <p className="text-xs text-slate-400">
                System Status
              </p>

              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">

                <span className="w-2 h-2 rounded-full bg-green-500" />

                Operational

              </div>

            </div>

          </div>

        </header>


        {/* ================================================== */}
        {/* Page Content */}
        {/* ================================================== */}

        <main className="min-w-0 flex-1 overflow-auto bg-slate-50 p-5 sm:p-6 lg:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;