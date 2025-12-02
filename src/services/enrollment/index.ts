"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const enrollStudent = async (payload: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/enrollment/enroll`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: JSON.stringify(payload),
      }
    ).then((x) => x.json());
    revalidateTag("enroll", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllEnrollment = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/enrollment/all`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        next: {
          tags: ["enroll"],
        },
      }
    ).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getStudentEnrollment = async (studentId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/enrollment/student/${studentId}`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    ).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getCourseEnrollment = async (courseId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/enrollment/course/${courseId}`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    ).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const markLessonComplete = async (
  enrollId: string,
  payload: FieldValues
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/enrollment/complete/${enrollId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: JSON.stringify(payload),
      }
    ).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
