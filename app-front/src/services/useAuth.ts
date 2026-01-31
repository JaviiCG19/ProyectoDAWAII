"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/services/auth.utils";

export function useAuth(allowedRoles?: string[]) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("current_role");
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");

    if (!token || !role) {
      router.replace("/login");
      return;
    }

    if (isTokenExpired()) {
      localStorage.clear();
      router.replace("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
      router.replace("/");
      return;
    }

    if (!roles.includes(role)) {
      router.replace("/");
      return;
    }

    setChecking(false);
  }, []);

  return checking;
}
