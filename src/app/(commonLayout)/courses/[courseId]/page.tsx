"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getSingleCourse } from "@/services/course";
import { enrollStudent } from "@/services/enrollment";
import { useUser } from "@/context/UserContext";
import Loading from "@/app/loading";

export default function ViewCourse() {
  const { courseId } = useParams() as { courseId: string };
  const router = useRouter();
  const { user } = useUser();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCourse = async () => {
    try {
      const res = await getSingleCourse(courseId);
      setCourse(res?.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load course!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      const payload = {
        student: user?.id,
        course: courseId,
        batchName: course?.batches?.[0]?.name,
      };

      const res = await enrollStudent(payload);

      if (res.success) {
        toast.success("Enrollment Successful!");
      } else {
        toast.error(res.message || "Enrollment Failed!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Enrollment Failed!");
    }
  };

  if (loading) return <Loading></Loading>;
  if (!course)
    return (
      <div className="p-10 text-center text-red-600">Course Not Found!</div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <Card className="border">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
          <p className="text-gray-600">{course.description}</p>
        </CardHeader>

        <CardContent className="grid lg:grid-cols-2 gap-6">
          {/* Thumbnail */}
          <img
            src={course.thumbnail}
            alt="Course"
            className="w-full h-64 object-cover rounded-xl"
          />

          {/* Course Info */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Instructor:</h4>
              <p>{course.instructor?.name}</p>
            </div>

            <div>
              <h4 className="font-semibold">Category:</h4>
              <p className="text-blue-600">{course.category}</p>
            </div>

            <div>
              <h4 className="font-semibold">Price:</h4>
              <p className="font-bold text-green-600">${course.price}</p>
            </div>

            {/* Enroll Button */}
            {user ? (
              <Button
                variant="default"
                className="w-full bg-black hover:bg-gray-800"
                onClick={handleEnroll}
              >
                Enroll Now
              </Button>
            ) : (
              <Button
                variant="default"
                className="w-full bg-black hover:bg-gray-800"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {course.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full bg-gray-900 text-white"
            >
              #{tag}
            </span>
          ))}
        </CardContent>
      </Card>

      {/* Syllabus */}
      <Card>
        <CardHeader>
          <CardTitle>Syllabus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {course.syllabus.map((item: string, i: number) => (
            <p key={i} className="border-l-4 pl-2 border-black">
              {item}
            </p>
          ))}
        </CardContent>
      </Card>

      {/* Batch Info */}
      <Card>
        <CardHeader>
          <CardTitle>Available Batches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {course.batches.map((batch: any, i: number) => (
            <p key={i}>
              📌 {batch.name} — Starts:{" "}
              {new Date(batch.startDate).toLocaleDateString()}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
