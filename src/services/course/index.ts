"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const createCourse = async (payload: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/course/create`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value || "",
        },
        body: JSON.stringify(payload),
      }
    ).then((x) => x.json());
    revalidateTag("course", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllCourses = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/course`, {
      method: "GET",
      next: {
        tags: ["course"],
      },
    }).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getSingleCourse = async (courseId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/course/${courseId}`,
      {
        method: "GET",
      }
    ).then((x) => x.json());
    revalidateTag("course", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const updateCourse = async (courseId: string, payload: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/course/update/${courseId}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: JSON.stringify(payload),
      }
    ).then((x) => x.json());
    revalidateTag("course", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteCourse = async (courseId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/course/delete/${courseId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value,
        },
      }
    ).then((x) => x.json());
    revalidateTag("course", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
