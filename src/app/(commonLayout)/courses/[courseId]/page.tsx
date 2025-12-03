import React from "react";

export default async function ViewCourse({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <div>ViewCourse :- {courseId}</div>;
}
