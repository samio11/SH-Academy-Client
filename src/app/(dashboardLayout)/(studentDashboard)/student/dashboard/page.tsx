// app/student-dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  User,
  Mail,
  BookOpen,
  CheckCircle,
  Clock,
  Calendar,
  BarChart3,
  Edit,
  Save,
  X,
} from "lucide-react";

// Shadcn Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Toaster } from "@/components/ui/sonner";
import { getUserByToken, updateUserByToken } from "@/services/user";
import { getStudentEnrollment } from "@/services/enrollment";

// Validation Schema
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface ILesson {
  title: string;
  videoUrl: string;
}

interface ICourse {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructor: IUser;
  category: string;
  lessons: ILesson[];
  tags: string[];
}

interface IEnrollment {
  _id: string;
  course: ICourse;
  batchName: string;
  completedLessons: number[];
  progressPercent: number;
  createdAt: string;
}

export default function StudentDashboard() {
  const [user, setUser] = useState<IUser | null>(null);
  const [enrollments, setEnrollments] = useState<IEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Fetch user data and enrollments
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchEnrollments();
    }
  }, [user?._id]);

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getUserByToken();
      if (response.success) {
        setUser(response.data);
      } else {
        toast.error("Failed to load user data");
      }
    } catch (error) {
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await getStudentEnrollment(user?._id || "");
      if (response.success) {
        setEnrollments(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    }
  };

  const handleProfileUpdate = async (data: ProfileFormValues) => {
    const loadingToast = toast.loading("Updating profile...");

    try {
      const response = await updateUserByToken(data);
      if (response.success) {
        setUser(response.data);
        setEditing(false);
        toast.success("Profile updated successfully", {
          id: loadingToast,
        });
      } else {
        toast.error("Failed to update profile", {
          id: loadingToast,
        });
      }
    } catch (error) {
      toast.error("Failed to update profile", {
        id: loadingToast,
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Student Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Track your progress and manage your learning journey
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile & Quick Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    {!editing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(true)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditing(false);
                            form.reset();
                          }}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={form.handleSubmit(handleProfileUpdate)}
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!editing ? (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                            {user ? getInitials(user.name) : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-2xl font-bold">{user?.name}</h3>
                          <div className="flex items-center justify-center gap-2 mt-1 text-gray-600">
                            <Mail className="h-4 w-4" />
                            <p>{user?.email}</p>
                          </div>
                          <Badge className="mt-2" variant="secondary">
                            {user?.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Learning Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Total Courses</span>
                      <span className="font-bold">{enrollments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Active Learning
                      </span>
                      <span className="font-bold">
                        {
                          enrollments.filter((e) => e.progressPercent < 100)
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Completed</span>
                      <span className="font-bold">
                        {
                          enrollments.filter((e) => e.progressPercent === 100)
                            .length
                        }
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Average Progress</p>
                    <p className="text-3xl font-bold text-primary mt-2">
                      {enrollments.length > 0
                        ? `${Math.round(
                            enrollments.reduce(
                              (acc, curr) => acc + curr.progressPercent,
                              0
                            ) / enrollments.length
                          )}%`
                        : "0%"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Courses & Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs for different views */}
              <Tabs defaultValue="enrolled" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="enrolled"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Enrolled Courses
                  </TabsTrigger>
                  <TabsTrigger
                    value="progress"
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Progress Tracking
                  </TabsTrigger>
                </TabsList>

                {/* Enrolled Courses Tab */}
                <TabsContent value="enrolled" className="space-y-4">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>My Courses</CardTitle>
                      <CardDescription>
                        All courses you are currently enrolled in
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {enrollments.length === 0 ? (
                        <div className="text-center py-12">
                          <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
                          <h3 className="mt-4 text-lg font-semibold">
                            No courses enrolled
                          </h3>
                          <p className="text-gray-600 mt-2">
                            Start your learning journey by enrolling in courses
                          </p>
                          <Button className="mt-4">Browse Courses</Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {enrollments.map((enrollment) => (
                            <Card
                              key={enrollment._id}
                              className="overflow-hidden hover:shadow-md transition-shadow"
                            >
                              <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                                {enrollment.course.thumbnail && (
                                  <img
                                    src={enrollment.course.thumbnail}
                                    alt={enrollment.course.title}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                <Badge className="absolute top-3 right-3 bg-white text-gray-800">
                                  {enrollment.course.category}
                                </Badge>
                              </div>
                              <CardContent className="pt-4">
                                <h4 className="font-bold text-lg mb-2 line-clamp-1">
                                  {enrollment.course.title}
                                </h4>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {enrollment.course.description}
                                </p>
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(enrollment.createdAt)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" />
                                    Batch: {enrollment.batchName}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Progress</span>
                                    <span className="font-semibold">
                                      {enrollment.progressPercent}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={enrollment.progressPercent}
                                    className="h-2"
                                  />
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                  <span className="text-sm">
                                    {enrollment.completedLessons.length} of{" "}
                                    {enrollment.course.lessons.length} lessons
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Progress Tracking Tab */}
                <TabsContent value="progress" className="space-y-4">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Detailed Progress Tracking</CardTitle>
                      <CardDescription>
                        Track your progress across all enrolled courses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {enrollments.length === 0 ? (
                        <div className="text-center py-12">
                          <BarChart3 className="h-12 w-12 mx-auto text-gray-400" />
                          <h3 className="mt-4 text-lg font-semibold">
                            No progress data
                          </h3>
                          <p className="text-gray-600 mt-2">
                            Enroll in courses to start tracking your progress
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {enrollments.map((enrollment) => (
                            <div key={enrollment._id} className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-bold">
                                    {enrollment.course.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Instructor:{" "}
                                    {enrollment.course.instructor.name}
                                  </p>
                                </div>
                                <Badge variant="default">
                                  {enrollment.progressPercent === 100
                                    ? "Completed"
                                    : "In Progress"}
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm font-medium">
                                    Overall Progress
                                  </span>
                                  <span className="font-bold">
                                    {enrollment.progressPercent}%
                                  </span>
                                </div>
                                <Progress
                                  value={enrollment.progressPercent}
                                  className="h-3"
                                />
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                  <p className="text-2xl font-bold text-primary">
                                    {enrollment.completedLessons.length}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Lessons Done
                                  </p>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                  <p className="text-2xl font-bold text-green-600">
                                    {enrollment.course.lessons.length -
                                      enrollment.completedLessons.length}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Lessons Left
                                  </p>
                                </div>
                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                  <p className="text-2xl font-bold text-purple-600">
                                    {enrollment.course.lessons.length}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Total Lessons
                                  </p>
                                </div>
                                <div className="text-center p-3 bg-amber-50 rounded-lg">
                                  <div className="flex items-center justify-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <p className="text-2xl font-bold text-amber-600">
                                      {enrollment.completedLessons.length > 0
                                        ? "50m"
                                        : "0m"}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Avg Time
                                  </p>
                                </div>
                              </div>

                              {/* Lesson List */}
                              <div className="pt-4">
                                <h5 className="font-semibold mb-3">
                                  Course Lessons
                                </h5>
                                <div className="space-y-2">
                                  {enrollment.course.lessons.map(
                                    (lesson, index) => (
                                      <div
                                        key={index}
                                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                                          enrollment.completedLessons.includes(
                                            index
                                          )
                                            ? "bg-green-50 border-green-200"
                                            : "bg-gray-50"
                                        }`}
                                      >
                                        <div
                                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                            enrollment.completedLessons.includes(
                                              index
                                            )
                                              ? "bg-green-100 text-green-600"
                                              : "bg-gray-200 text-gray-600"
                                          }`}
                                        >
                                          {enrollment.completedLessons.includes(
                                            index
                                          ) ? (
                                            <CheckCircle className="h-4 w-4" />
                                          ) : (
                                            <span className="text-sm font-medium">
                                              {index + 1}
                                            </span>
                                          )}
                                        </div>
                                        <span className="flex-1">
                                          {lesson.title}
                                        </span>
                                        <Badge variant="outline">
                                          {enrollment.completedLessons.includes(
                                            index
                                          )
                                            ? "Completed"
                                            : "Pending"}
                                        </Badge>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              <Separator className="my-4" />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
}
