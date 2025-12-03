"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface EnrollmentTrend {
  count: number;
  date: string;
}

interface TopCourse {
  enrollmentCount: number;
  courseId: string;
  title: string;
}

interface CategoryDistribution {
  count: number;
  category: string;
}

interface RecentEnrollment {
  _id: string;
  studentName: string;
  courseName: string;
  batchName: string;
  createdAt: string;
}

interface AdminStats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  totalInstructors: number;
  blockedUsers: number;
  enrollmentTrends: EnrollmentTrend[];
  topCourses: TopCourse[];
  categoryDistribution: CategoryDistribution[];
  recentEnrollments: RecentEnrollment[];
}

// Mock data generator
const generateMockStats = (): AdminStats => {
  return {
    totalStudents: 2847,
    totalCourses: 156,
    totalEnrollments: 4293,
    totalInstructors: 89,
    blockedUsers: 12,
    enrollmentTrends: [
      { date: "Jan", count: 320 },
      { date: "Feb", count: 450 },
      { date: "Mar", count: 580 },
      { date: "Apr", count: 520 },
      { date: "May", count: 680 },
      { date: "Jun", count: 750 },
    ],
    topCourses: [
      {
        courseId: "1",
        title: "Advanced React Development",
        enrollmentCount: 342,
      },
      {
        courseId: "2",
        title: "Machine Learning Fundamentals",
        enrollmentCount: 298,
      },
      { courseId: "3", title: "UI/UX Design Mastery", enrollmentCount: 276 },
      { courseId: "4", title: "Python for Data Science", enrollmentCount: 251 },
      { courseId: "5", title: "Cloud Architecture", enrollmentCount: 234 },
    ],
    categoryDistribution: [
      { category: "Development", count: 45 },
      { category: "Design", count: 32 },
      { category: "Business", count: 28 },
      { category: "Data Science", count: 35 },
      { category: "Marketing", count: 16 },
    ],
    recentEnrollments: [
      {
        _id: "1",
        studentName: "Sarah Johnson",
        courseName: "Advanced React Development",
        batchName: "Batch A-2024",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        studentName: "Michael Chen",
        courseName: "Machine Learning Fundamentals",
        batchName: "Batch B-2024",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        _id: "3",
        studentName: "Emily Rodriguez",
        courseName: "UI/UX Design Mastery",
        batchName: "Batch C-2024",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        _id: "4",
        studentName: "David Kim",
        courseName: "Python for Data Science",
        batchName: "Batch A-2024",
        createdAt: new Date(Date.now() - 10800000).toISOString(),
      },
    ],
  };
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      setStats(generateMockStats());
    }, 500);
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Students",
      value: stats.totalStudents,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      title: "Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-50 to-purple-50",
    },
    {
      title: "Enrollments",
      value: stats.totalEnrollments,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
    },
    {
      title: "Instructors",
      value: stats.totalInstructors,
      icon: GraduationCap,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
    },
    {
      title: "Blocked Users",
      value: stats.blockedUsers,
      icon: UserX,
      gradient: "from-rose-500 to-pink-500",
      bgGradient: "from-rose-50 to-pink-50",
    },
  ];

  const enrollmentChartData = {
    labels: stats.enrollmentTrends.map((e) => e.date),
    datasets: [
      {
        label: "Enrollments",
        data: stats.enrollmentTrends.map((e) => e.count),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
    ],
  };

  const categoryChartData = {
    labels: stats.categoryDistribution.map((c) => c.category),
    datasets: [
      {
        data: stats.categoryDistribution.map((c) => c.count),
        backgroundColor: [
          "#8b5cf6",
          "#06b6d4",
          "#10b981",
          "#f59e0b",
          "#ec4899",
        ],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-white text-black bg-clip-text  mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50`}
                ></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-1">
                    {card.value.toLocaleString()}
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">
                    {card.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enrollment Trends */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Enrollment Trends
              </h2>
              <div className="px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold">
                Last 6 Months
              </div>
            </div>
            <Line data={enrollmentChartData} options={chartOptions} />
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Categories
            </h2>
            <Doughnut data={categoryChartData} options={doughnutOptions} />
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Top Performing Courses
          </h2>
          <div className="space-y-3">
            {stats.topCourses.map((course, index) => (
              <div
                key={course.courseId}
                className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white hover:from-violet-50 hover:to-purple-50 transition-all duration-300 border border-slate-100 hover:border-violet-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 text-white font-bold shadow-md">
                    {index + 1}
                  </div>
                  <span className="font-semibold text-slate-800 group-hover:text-violet-700 transition-colors">
                    {course.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full font-bold text-sm">
                    {course.enrollmentCount}
                  </span>
                  <span className="text-slate-500 text-sm">enrollments</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow overflow-hidden">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Recent Enrollments
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left p-4 text-sm font-bold text-slate-600 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="text-left p-4 text-sm font-bold text-slate-600 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="text-left p-4 text-sm font-bold text-slate-600 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="text-left p-4 text-sm font-bold text-slate-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentEnrollments.map((enroll, index) => (
                  <tr
                    key={enroll._id}
                    className="border-b border-slate-100 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md">
                          {enroll.studentName.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800">
                          {enroll.studentName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700">{enroll.courseName}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                        {enroll.batchName}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">
                      {new Date(enroll.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
