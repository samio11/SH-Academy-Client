"use server";

import { cookies } from "next/headers";

export const getAdminStats = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/state`, {
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
export const getEnrollmentTrends = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/enroll`, {
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
export const getUserGrowth = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/admin/user`, {
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
