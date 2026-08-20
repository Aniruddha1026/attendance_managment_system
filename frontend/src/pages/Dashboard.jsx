import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/api/dashboard");

        console.log("Dashboard data:", response.data);

        setStats(response.data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  const totalEmployees = stats?.total_employees ?? 0;
  const activeEmployees = stats?.active_employees ?? 0;

  const presentToday = stats?.present_today ?? 0;
  const absentToday = stats?.absent_today ?? 0;
  const halfDayToday = stats?.half_day_today ?? 0;
  const leaveToday = stats?.leave_today ?? 0;

  /*
   * Employees expected to work today.
   *
   * Leave employees are excluded because
   * approved leave should not reduce attendance.
   */
  const attendanceTotal =
    presentToday +
    absentToday +
    halfDayToday;

  /*
   * Half Day counts as attendance.
   *
   * Example:
   * Present = 80
   * Half Day = 5
   * Absent = 10
   *
   * Attendance = (80 + 5) / 95 = 89%
   */
  const attendancePercentage =
    attendanceTotal > 0
      ? Math.round(
          ((presentToday + halfDayToday) /
            attendanceTotal) *
            100
        )
      : 0;

  const activePercentage =
    totalEmployees > 0
      ? Math.round(
          (activeEmployees / totalEmployees) * 100
        )
      : 0;

  /*
   * Individual percentages for the summary.
   */
  const presentPercentage =
    attendanceTotal > 0
      ? Math.round(
          (presentToday / attendanceTotal) * 100
        )
      : 0;

  const absentPercentage =
    attendanceTotal > 0
      ? Math.round(
          (absentToday / attendanceTotal) * 100
        )
      : 0;

  const halfDayPercentage =
    attendanceTotal > 0
      ? Math.round(
          (halfDayToday / attendanceTotal) * 100
        )
      : 0;

  /*
   * Leave is calculated separately because
   * employees on leave are not expected to work.
   */
  const leavePercentage =
    totalEmployees > 0
      ? Math.round(
          (leaveToday / totalEmployees) * 100
        )
      : 0;

  return (
    <div className="w-full">

      {/* ================================================== */}
      {/* Header */}
      {/* ================================================== */}

      <div className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <p className="text-sm font-medium text-blue-600">
            Overview
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back, Admin. Here's your workforce overview.
          </p>

        </div>

        <div className="text-sm text-slate-400">

          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}

        </div>

      </div>


      {/* ================================================== */}
      {/* Statistics */}
      {/* ================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Employees"
          value={totalEmployees}
          subtitle="All employees"
          icon="👥"
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Active Employees"
          value={activeEmployees}
          subtitle={`${activePercentage}% of workforce`}
          icon="✓"
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Present Today"
          value={presentToday}
          subtitle="Marked present"
          icon="●"
          iconClass="bg-violet-50 text-violet-600"
        />

        <StatCard
          title="Absent Today"
          value={absentToday}
          subtitle="Not marked present"
          icon="!"
          iconClass="bg-amber-50 text-amber-600"
        />

      </div>


      {/* ================================================== */}
      {/* Main Section */}
      {/* ================================================== */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* ================================================== */}
        {/* Attendance Today */}
        {/* ================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <h2 className="font-semibold text-slate-900">
              Attendance Today
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current attendance overview
            </p>

          </div>


          <div className="p-6">

            {/* Attendance Circle */}

            <div className="flex flex-col items-center justify-center">

              <div
                className="relative flex h-40 w-40 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(
                    #2563eb ${attendancePercentage}%,
                    #e2e8f0 ${attendancePercentage}% 100%
                  )`,
                }}
              >

                <div className="flex h-30 w-30 flex-col items-center justify-center rounded-full bg-white">

                  <span className="text-3xl font-bold text-slate-900">
                    {attendancePercentage}%
                  </span>

                  <span className="text-xs text-slate-400">
                    attendance
                  </span>

                </div>

              </div>

            </div>


            {/* Attendance Breakdown */}

            <div className="mt-6 grid grid-cols-2 gap-4">

              <AttendanceBox
                label="Present"
                value={presentToday}
                dot="bg-blue-600"
              />

              <AttendanceBox
                label="Absent"
                value={absentToday}
                dot="bg-slate-300"
              />

              <AttendanceBox
                label="Half Day"
                value={halfDayToday}
                dot="bg-amber-500"
              />

              <AttendanceBox
                label="Leave"
                value={leaveToday}
                dot="bg-violet-500"
              />

            </div>

          </div>

        </div>


        {/* ================================================== */}
        {/* Employees by Department */}
        {/* ================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <h2 className="font-semibold text-slate-900">
              Employees by Department
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Distribution across departments
            </p>

          </div>


          <div className="p-6">

            {stats?.department_counts?.length > 0 ? (

              <div className="space-y-6">

                {stats.department_counts.map(
                  (department) => {

                    const count =
                      department.employee_count ?? 0;

                    const percentage =
                      totalEmployees > 0
                        ? Math.round(
                            (count / totalEmployees) * 100
                          )
                        : 0;

                    return (
                      <div
                        key={department.department}
                      >

                        <div className="mb-2 flex items-center justify-between">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">

                              {department.department
                                ?.charAt(0)
                                .toUpperCase()}

                            </div>

                            <span className="text-sm font-medium text-slate-700">
                              {department.department}
                            </span>

                          </div>

                          <div className="flex items-center gap-2">

                            <span className="text-sm font-semibold text-slate-800">
                              {count}
                            </span>

                            <span className="text-xs text-slate-400">
                              {percentage}%
                            </span>

                          </div>

                        </div>


                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">

                          <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            ) : (

              <div className="flex min-h-[220px] items-center justify-center text-sm text-slate-400">
                No department data available.
              </div>

            )}

          </div>

        </div>

      </div>


      {/* ================================================== */}
      {/* Bottom Section */}
      {/* ================================================== */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* ================================================== */}
        {/* Quick Actions */}
        {/* ================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <h2 className="font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Frequently used actions
            </p>

          </div>


          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">

            {/* Add Employee */}

            <button
              onClick={() =>
                navigate("/employees/add")
              }
              className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl font-semibold text-blue-600">
                +
              </div>

              <div>

                <p className="font-semibold text-slate-800">
                  Add Employee
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Create a new employee
                </p>

              </div>

            </button>


            {/* Mark Attendance */}

            <button
              onClick={() =>
                navigate("/attendance/mark")
              }
              className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
            >

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-lg font-semibold text-emerald-600">
                ✓
              </div>

              <div>

                <p className="font-semibold text-slate-800">
                  Mark Attendance
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Record today's attendance
                </p>

              </div>

            </button>

          </div>

        </div>


        {/* ================================================== */}
        {/* Attendance Summary */}
        {/* ================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold text-slate-900">
                  Attendance Summary
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Today's attendance breakdown
                </p>

              </div>

              <button
                onClick={() =>
                  navigate("/attendance")
                }
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View all →
              </button>

            </div>

          </div>


          <div className="space-y-6 p-6">

            {/* Present */}

            <SummaryRow
              label="Present"
              value={presentToday}
              percentage={presentPercentage}
            />


            {/* Absent */}

            <SummaryRow
              label="Absent"
              value={absentToday}
              percentage={absentPercentage}
            />


            {/* Half Day */}

            <SummaryRow
              label="Half Day"
              value={halfDayToday}
              percentage={halfDayPercentage}
            />


            {/* Leave */}

            <SummaryRow
              label="Leave"
              value={leaveToday}
              percentage={leavePercentage}
            />

          </div>

        </div>

      </div>

    </div>
  );
}


/* ================================================== */
/* Stat Card */
/* ================================================== */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>

        </div>


        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


/* ================================================== */
/* Attendance Box */
/* ================================================== */

function AttendanceBox({
  label,
  value,
  dot,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <div className="flex items-center gap-2">

        <span
          className={`h-2.5 w-2.5 rounded-full ${dot}`}
        />

        <span className="text-sm text-slate-500">
          {label}
        </span>

      </div>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}


/* ================================================== */
/* Summary Row */
/* ================================================== */

function SummaryRow({
  label,
  value,
  percentage,
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>

        <span className="text-sm font-semibold text-slate-800">
          {value}
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">

        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}


export default Dashboard;