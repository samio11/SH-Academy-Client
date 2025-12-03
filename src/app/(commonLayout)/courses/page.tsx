"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const LIMIT = 3; // show 3 courses per page

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [sortedCourses, setSortedCourses] = useState<any[]>([]);
  const [sortType, setSortType] = useState<string>("none");
  const [page, setPage] = useState(1);

  const getAllCourses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/course`, {
        method: "GET",
      });
      const data = await res.json();
      const courseData = data?.data?.data || [];
      setCourses(courseData);
      setSortedCourses(courseData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  // SORT FUNCTION
  const handleSort = (type: string) => {
    setSortType(type);
    const sorted = [...courses];

    if (type === "low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (type === "high") {
      sorted.sort((a, b) => b.price - a.price);
    }

    setSortedCourses(sorted);
    setPage(1);
  };

  // PAGINATION LOGIC
  const startIndex = (page - 1) * LIMIT;
  const paginatedData = sortedCourses.slice(startIndex, startIndex + LIMIT);
  const totalPages = Math.ceil(sortedCourses.length / LIMIT);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>

      {/* Sorting */}
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 border ${
            sortType === "low" ? "bg-black text-white" : ""
          }`}
          onClick={() => handleSort("low")}
        >
          Price: Low → High
        </button>

        <button
          className={`px-4 py-2 border ${
            sortType === "high" ? "bg-black text-white" : ""
          }`}
          onClick={() => handleSort("high")}
        >
          Price: High → Low
        </button>
      </div>

      {/* COURSE LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paginatedData.map((course) => (
          <div key={course._id} className="border p-4 rounded-lg shadow">
            <div className="relative w-full h-48">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold mt-2">{course.title}</h2>
            <p className="text-gray-600">{course.category}</p>
            <p className="font-bold text-xl">${course.price}</p>
            <div className="flex justify-center items-center w-full">
              <Link
                href={`/courses/${course._id}`}
                className="px-5 py-1 w-[50%] bg-black text-white rounded-md text-center"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION BUTTONS */}
      <div className="flex justify-center gap-3 mt-6">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 border ${
              page === i + 1 ? "bg-black text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
