"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
  FileText,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import {
  getStudentEnrollment,
  markLessonComplete,
} from "@/services/enrollment";
import { getAssignmentByUser, submitAssignment } from "@/services/assignments";
import { getQuiz, submitQuiz } from "@/services/quiz";

export default function EnrollCourse() {
  const { user } = useUser();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [assignmentText, setAssignmentText] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [videoDialog, setVideoDialog] = useState(false);
  const [loadingLessonData, setLoadingLessonData] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await getStudentEnrollment(user?.id as string);
      if (response.success) {
        setEnrollments(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch enrollments");
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";

    // Already an embed URL
    if (url.includes("youtube.com/embed/")) return url;

    // Extract video ID from various YouTube URL formats
    let videoId = "";

    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/shorts/")) {
      videoId = url.split("shorts/")[1]?.split("?")[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const handleLessonClick = async (
    enrollment: any,
    lesson: any,
    index: number
  ) => {
    setSelectedCourse(enrollment);
    setCurrentLesson({ ...lesson, index });
    setAssignment(null);
    setQuiz(null);
    setAssignmentText("");
    setQuizAnswers([]);
    setVideoDialog(true);
    setLoadingLessonData(true);

    // Fetch assignment and quiz for this lesson
    try {
      const assignmentRes = await getAssignmentByUser(
        enrollment.course._id,
        index
      );

      if (assignmentRes.success && assignmentRes.data) {
        setAssignment(assignmentRes.data);
      }
    } catch (error) {
      console.error("Error fetching assignment:", error);
    }

    try {
      // Note: You may need to update getQuiz to accept courseId and lessonIndex
      const quizRes = await getQuiz();

      if (quizRes.success && quizRes.data) {
        setQuiz(quizRes.data);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoadingLessonData(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!selectedCourse || currentLesson === null) return;

    try {
      setSubmitting(true);
      const response = await markLessonComplete(selectedCourse._id, {
        lessonIndex: currentLesson.index,
      });

      if (response.success) {
        toast.success("Lesson marked as complete!");
        await fetchEnrollments();

        // Update selected course with new data
        const updatedEnrollment = response.data;
        setSelectedCourse(updatedEnrollment);
      }
    } catch (error) {
      toast.error("Failed to mark lesson complete");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!assignment || !assignmentText.trim()) {
      toast.error("Please enter your answer");
      return;
    }

    try {
      setSubmitting(true);
      const response = await submitAssignment(assignment._id, {
        student: user?.id,
        answerText: assignmentText,
      });

      if (response.success) {
        toast.success("Assignment submitted successfully!");
        setAssignmentText("");
      }
    } catch (error) {
      toast.error("Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || quizAnswers.length !== quiz.questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    try {
      setSubmitting(true);
      const response = await submitQuiz(quiz._id, {
        studentId: user?.id,
        answers: quizAnswers,
      });

      if (response.success) {
        toast.success(`Quiz submitted! Your score: ${response.data.score}`);
        setQuizAnswers([]);
      }
    } catch (error) {
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const isLessonCompleted = (enrollment: any, lessonIndex: number) => {
    return enrollment.completedLessons?.includes(lessonIndex);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Enrolled Courses</h2>
        <p className="text-muted-foreground">
          Start learning by enrolling in a course!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Enrolled Courses</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment) => (
          <Card key={enrollment._id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="line-clamp-2">
                    {enrollment.course.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {enrollment.batchName && (
                      <Badge variant="outline" className="mb-2">
                        {enrollment.batchName}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {Math.min(enrollment.progressPercent || 0, 100)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(enrollment.progressPercent || 0, 100)}
                    className="h-2"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {enrollment.completedLessons?.length || 0} of{" "}
                    {enrollment.course.lessons?.length || 0} lessons completed
                  </span>
                </div>

                <Separator />

                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {enrollment.course.lessons?.map(
                      (lesson: any, index: number) => (
                        <Button
                          key={index}
                          variant={
                            isLessonCompleted(enrollment, index)
                              ? "secondary"
                              : "outline"
                          }
                          className="w-full justify-start"
                          onClick={() =>
                            handleLessonClick(enrollment, lesson, index)
                          }
                        >
                          {isLessonCompleted(enrollment, index) ? (
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          ) : (
                            <PlayCircle className="w-4 h-4 mr-2" />
                          )}
                          <span className="truncate">
                            {index + 1}. {lesson.title}
                          </span>
                        </Button>
                      )
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>

            <CardFooter>
              <Badge
                variant={
                  enrollment.progressPercent >= 100 ? "default" : "secondary"
                }
                className="w-full justify-center"
              >
                {enrollment.progressPercent >= 100
                  ? "Completed"
                  : "In Progress"}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Video Lesson Dialog */}
      <Dialog open={videoDialog} onOpenChange={setVideoDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentLesson?.title}</DialogTitle>
            <DialogDescription>
              Lesson {(currentLesson?.index || 0) + 1}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="video" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="video">
                <PlayCircle className="w-4 h-4 mr-2" />
                Video
              </TabsTrigger>
              <TabsTrigger value="assignment">
                <FileText className="w-4 h-4 mr-2" />
                Assignment
              </TabsTrigger>
              <TabsTrigger value="quiz">
                <ClipboardList className="w-4 h-4 mr-2" />
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="space-y-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={getYouTubeEmbedUrl(currentLesson?.videoUrl)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentLesson?.title}
                />
              </div>

              <div className="flex justify-between items-center">
                {selectedCourse &&
                  !isLessonCompleted(selectedCourse, currentLesson?.index) && (
                    <Button onClick={handleMarkComplete} disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Marking...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Complete
                        </>
                      )}
                    </Button>
                  )}
                {selectedCourse &&
                  isLessonCompleted(selectedCourse, currentLesson?.index) && (
                    <Badge
                      variant="default"
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </Badge>
                  )}
              </div>
            </TabsContent>

            <TabsContent value="assignment" className="space-y-4">
              {loadingLessonData ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : assignment ? (
                <>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {assignment.instructions}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        Deadline:{" "}
                        {new Date(assignment.deadLine).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="answer">Your Answer</Label>
                    <Textarea
                      id="answer"
                      placeholder="Type your answer here..."
                      value={assignmentText}
                      onChange={(e) => setAssignmentText(e.target.value)}
                      rows={8}
                    />
                  </div>

                  <Button
                    onClick={handleSubmitAssignment}
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Assignment"
                    )}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    No assignment available for this lesson
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="quiz" className="space-y-4">
              {loadingLessonData ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : quiz ? (
                <>
                  <ScrollArea className="h-96">
                    <div className="space-y-6 pr-4">
                      {quiz.questions?.map((question: any, qIndex: number) => (
                        <div key={qIndex} className="space-y-3">
                          <h4 className="font-medium">
                            {qIndex + 1}. {question.question}
                          </h4>
                          <RadioGroup
                            value={quizAnswers[qIndex]?.toString()}
                            onValueChange={(value) => {
                              const newAnswers = [...quizAnswers];
                              newAnswers[qIndex] = parseInt(value);
                              setQuizAnswers(newAnswers);
                            }}
                          >
                            {question.options?.map(
                              (option: string, oIndex: number) => (
                                <div
                                  key={oIndex}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={oIndex.toString()}
                                    id={`q${qIndex}-o${oIndex}`}
                                  />
                                  <Label
                                    htmlFor={`q${qIndex}-o${oIndex}`}
                                    className="cursor-pointer"
                                  >
                                    {option}
                                  </Label>
                                </div>
                              )
                            )}
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Quiz"
                    )}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ClipboardList className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    No quiz available for this lesson
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
