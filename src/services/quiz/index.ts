"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const createQuiz = async (payload: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/quiz/create`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      body: JSON.stringify(payload),
    }).then((x) => x.json());
    revalidateTag("quiz", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAllQuiz = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/quiz/all`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      next: {
        tags: ["quiz"],
      },
    }).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getQuiz = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/quiz`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    }).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const submitQuiz = async (quizId: string, payload: FieldValues) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/quiz/submit/${quizId}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: (await cookies()).get("accessToken")!.value,
        },
        body: JSON.stringify(payload),
      }
    ).then((x) => x.json());
    revalidateTag("quiz", "max");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
