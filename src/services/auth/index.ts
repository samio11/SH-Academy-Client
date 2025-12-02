"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { IUser } from "@/types/user.type";

export const userLogin = async (payload: FieldValues) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result?.success) {
      (await cookies()).set("accessToken", result?.data?.accessToken);
      (await cookies()).set("refreshToken", result?.data?.refreshToken);
    }
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    (await cookies()).delete("accessToken");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const userRegister = async (payload: FormData) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/auth/register`,
      {
        method: "POST",
        body: payload,
      }
    );
    revalidateTag("user", "max");
    const result = await res.json();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    let decoded = null;
    if (token) {
      decoded = await jwtDecode<IUser>(token);
      return decoded;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
