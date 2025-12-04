"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Loader2,
} from "lucide-react";
import { format, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

import { FieldValues, useForm } from "react-hook-form";
import { getAllCourses } from "@/services/course";
import {
  createAssignment,
  getAllAssignmentAdmin,
} from "@/services/assignments";
import { createQuiz, getAllQuiz } from "@/services/quiz";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  instructor: { name: string };
}

interface Assignment {
  _id: string;
  title: string;
  instructions: string;
  deadLine: string; // Note: capital L as per your model
  course: { title: string };
  lessonIndex: number;
  submissions: any[];
}

interface Quiz {
  _id: string;
  course: { title: string };
  lessonIndex: number;
  questions: any[];
  results: any[];
}

interface AssignmentFormData {
  lessonIndex: number;
  title: string;
  instructions: string;
  deadLine: Date;
}

export default function Manage_Assignment_quiz() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState({
    courses: false,
    assignments: false,
    quizzes: false,
    creatingAssignment: false,
    creatingQuiz: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentDate, setAssignmentDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState("assignments");

  const assignmentForm = useForm<AssignmentFormData>();
  const quizForm = useForm();

  // Fetch all data
  useEffect(() => {
    fetchCourses();
    fetchAssignments();
    fetchQuizzes();
  }, []);

  const fetchCourses = async () => {
    setLoading((prev) => ({ ...prev, courses: true }));
    try {
      const response = await getAllCourses("");
      if (response.success) {
        setCourses(response.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading((prev) => ({ ...prev, courses: false }));
    }
  };

  const fetchAssignments = async () => {
    setLoading((prev) => ({ ...prev, assignments: true }));
    try {
      const response = await getAllAssignmentAdmin();
      if (response.success && response.data) {
        setAssignments(response.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch assignments");
    } finally {
      setLoading((prev) => ({ ...prev, assignments: false }));
    }
  };

  const fetchQuizzes = async () => {
    setLoading((prev) => ({ ...prev, quizzes: true }));
    try {
      const response = await getAllQuiz();
      if (response.success && response.data) {
        setQuizzes(response.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading((prev) => ({ ...prev, quizzes: false }));
    }
  };

  // Handle assignment creation
  const handleCreateAssignment = async (data: AssignmentFormData) => {
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    if (!assignmentDate) {
      toast.error("Please select a deadline");
      return;
    }

    setLoading((prev) => ({ ...prev, creatingAssignment: true }));
    try {
      const payload = {
        ...data,
        course: selectedCourse,
        deadLine: assignmentDate, // Use deadLine with capital L
      };

      const response = await createAssignment(payload);
      if (response.success) {
        toast.success("Assignment created successfully!");
        assignmentForm.reset();
        setAssignmentDate(undefined);
        fetchAssignments();
      } else {
        toast.error(response.message || "Failed to create assignment");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to create assignment");
    } finally {
      setLoading((prev) => ({ ...prev, creatingAssignment: false }));
    }
  };

  // Handle quiz creation
  const handleCreateQuiz = async (data: FieldValues) => {
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    try {
      let questions;
      try {
        questions = JSON.parse(data.questions);
      } catch {
        toast.error("Invalid JSON format for questions");
        return;
      }

      const payload = {
        course: selectedCourse,
        lessonIndex: data.lessonIndex,
        questions: questions,
      };

      setLoading((prev) => ({ ...prev, creatingQuiz: true }));
      const response = await createQuiz(payload);
      if (response.success) {
        toast.success("Quiz created successfully!");
        quizForm.reset();
        fetchQuizzes();
      } else {
        toast.error(response.message || "Failed to create quiz");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to create quiz");
    } finally {
      setLoading((prev) => ({ ...prev, creatingQuiz: false }));
    }
  };

  // Filter data based on search
  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Safe date formatting function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isValid(date)) {
        return format(date, "MMM dd, yyyy");
      }
      return "Invalid date";
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Assessments
          </h1>
          <p className="text-muted-foreground">
            Create and manage assignments and quizzes for courses
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Create Forms */}
        <div className="lg:col-span-1 space-y-6">
          {/* Course Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Course</CardTitle>
              <CardDescription>
                Choose a course to manage assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedCourse}
                onValueChange={setSelectedCourse}
                disabled={loading.courses}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.title} ({course.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCourse && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <h4 className="font-semibold">
                    {courses.find((c) => c._id === selectedCourse)?.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {courses.find((c) => c._id === selectedCourse)?.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create Assignment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Assignment
              </CardTitle>
              <CardDescription>
                Add a new assignment for the selected course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={assignmentForm.handleSubmit(handleCreateAssignment)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="lessonIndex">Lesson Index</Label>
                  <Input
                    id="lessonIndex"
                    type="number"
                    min="1"
                    {...assignmentForm.register("lessonIndex", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    placeholder="Enter lesson index"
                    disabled={loading.creatingAssignment}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input
                    id="title"
                    {...assignmentForm.register("title", { required: true })}
                    placeholder="Enter assignment title"
                    disabled={loading.creatingAssignment}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    {...assignmentForm.register("instructions", {
                      required: true,
                    })}
                    placeholder="Enter assignment instructions"
                    rows={4}
                    disabled={loading.creatingAssignment}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Deadline *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !assignmentDate && "text-muted-foreground"
                        )}
                        disabled={loading.creatingAssignment}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {assignmentDate ? (
                          format(assignmentDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={assignmentDate}
                        onSelect={setAssignmentDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!selectedCourse || loading.creatingAssignment}
                >
                  {loading.creatingAssignment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Assignment"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Create Quiz Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Quiz
              </CardTitle>
              <CardDescription>
                Add a new quiz for the selected course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={quizForm.handleSubmit(handleCreateQuiz)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="quizLessonIndex">Lesson Index</Label>
                  <Input
                    id="quizLessonIndex"
                    type="number"
                    min="1"
                    {...quizForm.register("lessonIndex", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    placeholder="Enter lesson index"
                    disabled={loading.creatingQuiz}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="questions">Questions (JSON Format)</Label>
                  <Textarea
                    id="questions"
                    {...quizForm.register("questions", { required: true })}
                    placeholder='[{"question": "What is...?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctIndex": 0}]'
                    rows={6}
                    disabled={loading.creatingQuiz}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter questions in JSON array format
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!selectedCourse || loading.creatingQuiz}
                >
                  {loading.creatingQuiz ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Quiz"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs for Viewing */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>All Assessments</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search assessments..."
                      className="pl-8 w-[200px] lg:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={loading.assignments || loading.quizzes}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={loading.assignments || loading.quizzes}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="assignments">
                    Assignments ({filteredAssignments.length})
                  </TabsTrigger>
                  <TabsTrigger value="quizzes">
                    Quizzes ({filteredQuizzes.length})
                  </TabsTrigger>
                </TabsList>

                {/* Assignments Tab */}
                <TabsContent value="assignments" className="space-y-4">
                  {loading.assignments ? (
                    <div className="text-center py-8 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin mr-2" />
                      Loading assignments...
                    </div>
                  ) : filteredAssignments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No assignments found. Create one to get started.
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Lesson</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Submissions</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAssignments.map((assignment) => (
                            <TableRow key={assignment._id}>
                              <TableCell className="font-medium">
                                {assignment.title}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {assignment.course?.title || "No course"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                Lesson {assignment.lessonIndex}
                              </TableCell>
                              <TableCell>
                                {formatDate(assignment.deadLine)}{" "}
                                {/* Fixed: deadLine not deadline */}
                              </TableCell>
                              <TableCell>
                                <Badge>
                                  {assignment.submissions?.length || 0}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>
                                        {assignment.title}
                                      </DialogTitle>
                                      <DialogDescription>
                                        Course:{" "}
                                        {assignment.course?.title ||
                                          "No course"}{" "}
                                        | Lesson: {assignment.lessonIndex}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Instructions</Label>
                                        <p className="mt-1 text-sm whitespace-pre-wrap">
                                          {assignment.instructions}
                                        </p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Lesson Index</Label>
                                          <p>{assignment.lessonIndex}</p>
                                        </div>
                                        <div>
                                          <Label>Deadline</Label>
                                          <p>
                                            {formatDate(assignment.deadLine)}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <Label>
                                          Submissions (
                                          {assignment.submissions?.length || 0})
                                        </Label>
                                        <div className="mt-2 space-y-2">
                                          {assignment.submissions?.length >
                                          0 ? (
                                            assignment.submissions.map(
                                              (sub, idx) => (
                                                <div
                                                  key={idx}
                                                  className="flex items-center justify-between p-3 border rounded-lg"
                                                >
                                                  <div>
                                                    <p className="font-medium">
                                                      Student Submission{" "}
                                                      {idx + 1}
                                                    </p>
                                                    {sub.answerText && (
                                                      <p className="text-sm text-muted-foreground mt-1">
                                                        {sub.answerText.length >
                                                        100
                                                          ? sub.answerText.substring(
                                                              0,
                                                              100
                                                            ) + "..."
                                                          : sub.answerText}
                                                      </p>
                                                    )}
                                                    {sub.answerLink && (
                                                      <a
                                                        href={sub.answerLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:underline"
                                                      >
                                                        View Submission Link
                                                      </a>
                                                    )}
                                                  </div>
                                                  <Badge
                                                    variant={
                                                      sub.score !== undefined
                                                        ? "default"
                                                        : "secondary"
                                                    }
                                                  >
                                                    {sub.score !== undefined
                                                      ? `Score: ${sub.score}`
                                                      : "Not graded"}
                                                  </Badge>
                                                </div>
                                              )
                                            )
                                          ) : (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                              No submissions yet
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline">
                                        Edit Assignment
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="space-y-4">
                  {loading.quizzes ? (
                    <div className="text-center py-8 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin mr-2" />
                      Loading quizzes...
                    </div>
                  ) : filteredQuizzes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No quizzes found. Create one to get started.
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Course</TableHead>
                            <TableHead>Lesson</TableHead>
                            <TableHead>Questions</TableHead>
                            <TableHead>Attempts</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredQuizzes.map((quiz) => (
                            <TableRow key={quiz._id}>
                              <TableCell className="font-medium">
                                <Badge variant="outline">
                                  {quiz.course?.title || "No course"}
                                </Badge>
                              </TableCell>
                              <TableCell>Lesson {quiz.lessonIndex}</TableCell>
                              <TableCell>
                                <Badge>
                                  {quiz.questions?.length || 0} questions
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {quiz.results?.length || 0} attempts
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Quiz Details</DialogTitle>
                                      <DialogDescription>
                                        Course:{" "}
                                        {quiz.course?.title || "No course"} |
                                        Lesson: {quiz.lessonIndex}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-6">
                                      <div>
                                        <Label>
                                          Questions (
                                          {quiz.questions?.length || 0})
                                        </Label>
                                        <div className="mt-3 space-y-4">
                                          {quiz.questions?.map(
                                            (question, idx) => (
                                              <Card key={idx}>
                                                <CardContent className="pt-4">
                                                  <p className="font-medium mb-3">
                                                    Q{idx + 1}:{" "}
                                                    {question.question}
                                                  </p>
                                                  <div className="space-y-2">
                                                    {question.options?.map(
                                                      (
                                                        option: string,
                                                        optIdx: number
                                                      ) => (
                                                        <div
                                                          key={optIdx}
                                                          className={`p-3 rounded-lg border ${
                                                            optIdx ===
                                                            question.correctIndex
                                                              ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                                                              : "bg-muted/50"
                                                          }`}
                                                        >
                                                          <div className="flex items-center justify-between">
                                                            <div className="flex items-center">
                                                              <span className="font-medium mr-3">
                                                                {String.fromCharCode(
                                                                  65 + optIdx
                                                                )}
                                                                .
                                                              </span>
                                                              <span>
                                                                {option}
                                                              </span>
                                                            </div>
                                                            {optIdx ===
                                                              question.correctIndex && (
                                                              <Badge className="bg-green-500">
                                                                Correct Answer
                                                              </Badge>
                                                            )}
                                                          </div>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                </CardContent>
                                              </Card>
                                            )
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        <Label>
                                          Results ({quiz.results?.length || 0}{" "}
                                          attempts)
                                        </Label>
                                        <div className="mt-3 space-y-2">
                                          {quiz.results?.length > 0 ? (
                                            quiz.results.map((result, idx) => (
                                              <div
                                                key={idx}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                              >
                                                <div>
                                                  <p className="font-medium">
                                                    Attempt {idx + 1}
                                                  </p>
                                                  <p className="text-sm text-muted-foreground">
                                                    Student ID:{" "}
                                                    {result.student?._id ||
                                                      `Student ${idx + 1}`}
                                                  </p>
                                                </div>
                                                <Badge variant="default">
                                                  Score: {result.score}
                                                </Badge>
                                              </div>
                                            ))
                                          ) : (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                              No attempts yet
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline">
                                        Edit Quiz
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {activeTab === "assignments"
                  ? filteredAssignments.length
                  : filteredQuizzes.length}{" "}
                assessments
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    fetchAssignments();
                    fetchQuizzes();
                  }}
                  disabled={loading.assignments || loading.quizzes}
                >
                  {loading.assignments || loading.quizzes ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Refresh Data
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
