"use client";

import { AdminAppSideBar } from "@/app/(dashboardLayout)/(adminDashboard)/admin/_AdminSidebar";
import { StudentAppSideBar } from "@/app/(dashboardLayout)/(studentDashboard)/student/_StudentSidebar";
import { useUser } from "@/context/UserContext";

import { ERole } from "@/types/user.type";

import React from "react";

export default function RoleBaseDashboardGererate() {
  const { user } = useUser();
  return (
    <div>
      {user && user.role === ERole.admin && <AdminAppSideBar></AdminAppSideBar>}
      {user && user.role === ERole.student && (
        <StudentAppSideBar></StudentAppSideBar>
      )}
    </div>
  );
}
