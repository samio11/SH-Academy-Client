"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Users,
  BookOpen,
  GraduationCap,
  UserX,
  TrendingUp,
} from "lucide-react";
import { getAdminStats } from "@/services/adminStatus";
import Loading from "@/app/loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const res = await getAdminStats();
      if (res?.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading || !stats) {
    return <Loading></Loading>;
  }

  const statCards = [
    {
      title: "Students",
      value: stats.totalStudents,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bg: "from-blue-50 to-cyan-50",
    },
    {
      title: "Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      gradient: "from-violet-500 to-purple-500",
      bg: "from-violet-50 to-purple-50",
    },
    {
      title: "Enrollments",
      value: stats.totalEnrollments,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-500",
      bg: "from-emerald-50 to-teal-50",
    },
    {
      title: "Instructors",
      value: stats.totalInstructors,
      icon: GraduationCap,
      gradient: "from-amber-500 to-orange-500",
      bg: "from-amber-50 to-orange-50",
    },
    {
      title: "Blocked Users",
      value: stats.blockedUsers,
      icon: UserX,
      gradient: "from-rose-500 to-pink-500",
      bg: "from-rose-50 to-pink-50",
    },
  ];

  const enrollmentChartData = {
    labels: stats.enrollmentTrends.map((e: any) =>
      new Date(e.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Enrollments",
        data: stats.enrollmentTrends.map((e: any) => e.count),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.15)",
        borderWidth: 3,
        pointRadius: 6,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryChartData = {
    labels: stats.categoryDistribution.map((c: any) => c.category),
    datasets: [
      {
        data: stats.categoryDistribution.map((c: any) => c.count),
        backgroundColor: [
          "#8b5cf6",
          "#06b6d4",
          "#10b981",
          "#f59e0b",
          "#ec4899",
        ],
        hoverOffset: 12,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-200 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 drop-shadow-sm">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 mt-1">
            Real-time performance metrics for your academy
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="group bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all"
              >
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${c.gradient} w-fit mb-3`}
                >
                  <Icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{c.value}</h3>
                <p className="text-slate-500 font-medium">{c.title}</p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md lg:col-span-2">
            <h2 className="font-bold text-xl text-slate-700 mb-4">
              Enrollment Trends
            </h2>
            <Line data={enrollmentChartData} />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="font-bold text-xl text-slate-700 mb-4">
              Course Categories
            </h2>
            <Doughnut data={categoryChartData} />
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="font-bold text-xl text-slate-700 mb-4">
            Recent Enrollments
          </h2>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-slate-600">
                <th className="pb-2">Student</th>
                <th className="pb-2">Course</th>
                <th className="pb-2">Batch</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentEnrollments.map((e: any) => (
                <tr key={e._id} className="border-b hover:bg-slate-50 text-sm">
                  <td className="py-3 font-medium">{e?.studentName}</td>
                  <td className="py-3">{e?.courseName}</td>
                  <td className="py-3">{e?.batchName}</td>
                  <td className="py-3">
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
