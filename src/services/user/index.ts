"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const getAllUserAdmin = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user`, {
      method: "GET",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      next: {
        tags: ["user"],
      },
    }).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getUserByToken = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/user/get-single`,
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
export const updateUserByToken = async (payload: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user/update`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      body: JSON.stringify(payload),
    }).then((x) => x.json());
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const blockUser = async (userId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/user/block/userId/${userId}`,
      {
        method: "POST",
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
export const unBlockUser = async (userId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/user/un-block/userId/${userId}`,
      {
        method: "POST",
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
