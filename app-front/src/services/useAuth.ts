"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { isTokenExpired } from "@/services/auth.utils";



export function useAuth(allowedRoles?: string[]) {
  const router = useRouter();
  const params = useParams();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("current_role");
    const idLocalUser = localStorage.getItem("id_local");
    const idResUser = localStorage.getItem("id_res"); 

    if (!token || !role) {
      router.replace("/login");
      return;
    }

    if (isTokenExpired()) {
      localStorage.clear();
      router.replace("/login?reason=expired");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
      router.replace("/");
      return;
    }

    // Para rol 2 (gerente corporativo): PERMITIR acceso aunque no tenga id_res
    if (role === "2") {
      // Si tiene id_res → opcional validar, pero no obligatorio
      // Si NO tiene → permitimos de todos modos (dashboard global)
      setChecking(false);
      return;
    }

    // Para otros roles (staff, etc.): sí validar id_local o id_res
    if (params?.id) {
      if (role !== "1" && String(idLocalUser) !== String(params.id)) {
        console.error("Acceso denegado");
        router.replace("/");
        return;
      }
    }

    setChecking(false);
  }, [params?.id, allowedRoles, router]);

  return checking;
}