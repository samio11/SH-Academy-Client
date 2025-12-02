import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const createAssignment = async (payload: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/assignment/create`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value || "",
        },
        body: JSON.stringify(payload),
      }
    ).then((x) => x.json());
    revalidateTag("assignment", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAssignmentByUser = async (
  courseId: string,
  lessonIndex: number
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/assignment/create?courseId=${courseId}&lessonIndex=${lessonIndex}`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value || "",
        },
      }
    ).then((x) => x.json());
    revalidateTag("assignment", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAllAssignmentAdmin = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/assignment/all`,
      {
        method: "GET",
        headers: {
          Authorization: (await cookies()).get("accessToken")!.value || "",
        },
        next: {
          tags: ["assignment"],
        },
      }
    ).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
