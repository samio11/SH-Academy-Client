"use client";
import { getAllCourses } from "@/services/course";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Course = {
  _id: string;
  title: string;
  thumbnail?: string;
  price: number;
  category?: string;
  tags?: string[];
};

export default function CourseSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const router = useRouter();

  // simple controls
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const fetchData = async () => {
    try {
      // build query string expected by your backend
      const qs = new URLSearchParams();

      if (search) qs.append("search", search);
      if (category) qs.append("category", category);
      if (sort) qs.append("sort", sort);

      const res = await getAllCourses(qs.toString());
      const dataArray = res?.data?.data || []; // safe fallback
      const meta = res?.data?.meta || { page: 1, totalPage: 1 };
      console.log(dataArray);
      setCourses(dataArray);
      setTotalPage(meta.totalPage ?? 1);
    } catch (err) {
      console.error("fetch courses error", err);
      setCourses([]);
      setTotalPage(1);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sort, category]);

  const onSearch = () => {
    setPage(1);
    fetchData();
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("");
    fetchData();
    setPage(1);
  };

  const handleCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  return (
    <section className="max-w-5xl mx-auto p-4">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between mb-4">
        <div className="flex gap-2 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category"
            className="px-3 py-2 border rounded-md bg-white"
          />
          <button
            onClick={onSearch}
            className="px-3 py-2 bg-black text-white rounded-md"
          >
            Search
          </button>
          <button
            onClick={clearFilters}
            className="px-3 py-2 border rounded-md"
          >
            Clear
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded-md bg-white"
          >
            <option value="">All categories</option>
            <option value="Web">Web</option>
            <option value="Programming">Programming</option>
            <option value="AI/ML">AI/ML</option>
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded-md bg-white"
          >
            <option value="">Sort by price</option>
            <option value="price">Low → High</option>
            <option value="-price">High → Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.length === 0 && (
          <div className="col-span-full text-center text-gray-600 py-8">
            No courses found.
          </div>
        )}

        {courses.slice(0, 6).map((c) => (
          <div
            key={c._id}
            className="border rounded-md overflow-hidden shadow-sm bg-white"
          >
            <div className="h-44 w-full bg-gray-100 flex items-center justify-center">
              {c.thumbnail ? (
                // simple img tag works in Next.js too if not using next/image
                // Replace with <Image /> if you want optimization
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-gray-500">No image</div>
              )}
            </div>

            <div className="p-3">
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <p className="text-sm text-gray-600">{c.category}</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {(c.tags ?? []).slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-1 border rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-xl font-bold">${c.price}</div>
                <button
                  onClick={() => handleCourse(c._id)}
                  className="px-3 py-1 bg-black text-white rounded-md"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
