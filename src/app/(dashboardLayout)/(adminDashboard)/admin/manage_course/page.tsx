"use client";

import React, { useEffect, useState } from "react";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/services/course";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import SingleImageUploader from "@/sheared/SIngleImageUploader";
import Image from "next/image";
import { useUser } from "@/context/UserContext";

interface Lesson {
  title: string;
  videoUrl: string;
}

interface Batch {
  name: string;
  startDate: string;
}

interface CreateCourseFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  syllabus: string[];
  lessons: Lesson[];
  batches: Batch[];
  thumbnail: File | null;
}

interface UpdateCourseFormData {
  title: string;
  description: string;
  price: number;
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const { user } = useUser();

  const createForm = useForm<CreateCourseFormData>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      tags: [],
      syllabus: [],
      lessons: [{ title: "", videoUrl: "" }],
      batches: [{ name: "", startDate: "" }],
      thumbnail: null,
    },
  });

  const updateForm = useForm<UpdateCourseFormData>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  const { control, register, handleSubmit, setValue, watch } = createForm;

  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({ control, name: "lessons" });

  const {
    fields: batchFields,
    append: appendBatch,
    remove: removeBatch,
  } = useFieldArray({ control, name: "batches" });

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses("");
      if (res.success) setCourses(res.data.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch courses");
    }
  };

  React.useEffect(() => {
    fetchCourses();
  }, []);

  // CREATE COURSE
  //   const onCreate = async (data: CreateCourseFormData) => {
  //     if (!user?.id) return toast.error("User not found");

  //     try {
  //       const formData = new FormData();
  //       formData.append("title", data.title);
  //       formData.append("description", data.description);
  //       formData.append("price", data.price.toString());
  //       formData.append("category", data.category);
  //       formData.append("instructor", user.id);

  //       formData.append("tags", JSON.stringify(data.tags));
  //       formData.append("syllabus", JSON.stringify(data.syllabus));
  //       formData.append("lessons", JSON.stringify(data.lessons));
  //       formData.append("batches", JSON.stringify(data.batches));

  //       if (data.thumbnail) formData.append("file", data.thumbnail);
  //       console.log("FormData contents:");
  //       for (const [key, value] of formData.entries()) {
  //         console.log(key, value);
  //       }

  //       const res = await createCourse(formData);
  //       console.log(res);
  //       if (res.success) {
  //         toast.success(res.message);
  //         setCreateOpen(false);
  //         createForm.reset();
  //         fetchCourses();
  //       } else toast.error(res.message || "Failed to create course");
  //     } catch (err) {
  //       console.log(err);
  //       toast.error("Failed to create course");
  //     }
  //   };
  const onCreate = async (data: CreateCourseFormData) => {
    if (!user?.id) return toast.error("User not found");

    try {
      const payload = {
        title: data.title,
        description: data.description,
        price: Number(data.price), // <-- ensure number
        category: data.category,
        instructor: user.id,
        tags: data.tags, // <-- already array
        syllabus: data.syllabus, // <-- already array
        lessons: data.lessons, // <-- already array of objects
        batches: data.batches, // <-- already array of objects
        thumbnail: data.thumbnail, // can be file or null
      };

      // If your backend supports multipart/form-data (for file upload)
      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        if (key === "thumbnail" && value) {
          formData.append("file", value as File);
        } else if (Array.isArray(value) || typeof value === "object") {
          // Send array/object as JSON string
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }

      // DEBUG: check FormData before sending
      for (const [k, v] of formData.entries()) {
        console.log(k, v);
      }

      const res = await createCourse(formData);
      console.log(res);
      if (res.success) {
        toast.success(res.message);
        setCreateOpen(false);
        createForm.reset();
        fetchCourses();
      } else {
        toast.error(res.message || "Failed to create course");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to create course");
    }
  };

  // UPDATE COURSE
  const onUpdate = async (data: UpdateCourseFormData) => {
    if (!selectedCourse) return;
    try {
      const res = await updateCourse(selectedCourse._id, data);
      if (res.success) {
        toast.success(res.message);
        setUpdateOpen(false);
        setSelectedCourse(null);
        updateForm.reset();
        fetchCourses();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update course");
    }
  };

  const handleEdit = (course: any) => {
    setSelectedCourse(course);
    setUpdateOpen(true);
    updateForm.reset({
      title: course.title,
      description: course.description,
      price: course.price,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await deleteCourse(id);
      if (res.success) {
        toast.success(res.message);
        fetchCourses();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete course");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Course Management</h2>

        {/* Create Course Modal */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>Create Course</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Course</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onCreate)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col">
                <Label>Title</Label>
                <Input {...register("title", { required: true })} />
              </div>

              <div className="flex flex-col">
                <Label>Description</Label>
                <Textarea {...register("description", { required: true })} />
              </div>

              <div className="flex flex-col">
                <Label>Price</Label>
                <Input
                  type="number"
                  {...register("price", {
                    required: true,
                    setValueAs: (v) => Number(v),
                  })}
                />
              </div>

              <div className="flex flex-col">
                <Label>Category</Label>
                <Input {...register("category", { required: true })} />
              </div>

              <div className="flex flex-col">
                <Label>Tags (comma separated)</Label>
                <Input
                  {...register("tags", {
                    setValueAs: (v) =>
                      typeof v === "string"
                        ? v
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                        : [],
                  })}
                />
              </div>

              <div className="flex flex-col">
                <Label>Syllabus (comma separated)</Label>
                <Input
                  {...register("syllabus", {
                    setValueAs: (v) =>
                      typeof v === "string"
                        ? v
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        : [],
                  })}
                />
              </div>

              {/* Lessons */}
              <div>
                <Label>Lessons</Label>
                {lessonFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Lesson Title"
                      {...register(`lessons.${index}.title` as const, {
                        required: true,
                      })}
                    />
                    <Input
                      placeholder="Video URL"
                      {...register(`lessons.${index}.videoUrl` as const, {
                        required: true,
                      })}
                    />
                    <Button
                      variant="destructive"
                      type="button"
                      onClick={() => removeLesson(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => appendLesson({ title: "", videoUrl: "" })}
                >
                  Add Lesson
                </Button>
              </div>

              {/* Batches */}
              <div>
                <Label>Batches</Label>
                {batchFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 mb-2">
                    <Input
                      placeholder="Batch Name"
                      {...register(`batches.${index}.name` as const, {
                        required: true,
                      })}
                    />
                    <Input
                      type="date"
                      {...register(`batches.${index}.startDate` as const, {
                        required: true,
                      })}
                    />
                    <Button
                      variant="destructive"
                      type="button"
                      onClick={() => removeBatch(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => appendBatch({ name: "", startDate: "" })}
                >
                  Add Batch
                </Button>
              </div>

              {/* Thumbnail */}
              <div>
                <Label>Thumbnail</Label>
                <Controller
                  control={control}
                  name="thumbnail"
                  render={({ field }) => (
                    <SingleImageUploader onChange={field.onChange} />
                  )}
                />
                {watch("thumbnail") && (
                  <div className="mt-2">
                    <Image
                      src={URL.createObjectURL(watch("thumbnail")!)}
                      alt="Thumbnail Preview"
                      width={150}
                      height={100}
                      className="rounded"
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell>{course.title}</TableCell>
              <TableCell>{course.category}</TableCell>
              <TableCell>${course.price}</TableCell>
              <TableCell>{course.instructor.name}</TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(course)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(course._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Update Modal */}
      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Course</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={updateForm.handleSubmit(onUpdate)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col">
              <Label>Title</Label>
              <Input {...updateForm.register("title", { required: true })} />
            </div>
            <div className="flex flex-col">
              <Label>Description</Label>
              <Textarea
                {...updateForm.register("description", { required: true })}
              />
            </div>
            <div className="flex flex-col">
              <Label>Price</Label>
              <Input
                type="number"
                {...updateForm.register("price", { required: true })}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
