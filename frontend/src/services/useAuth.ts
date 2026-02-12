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

    // Si no hay sesión, al login
    if (!token || !role) {
      router.replace("/login");
      return;
    }

    // Si el token expiró
    if (isTokenExpired()) {
      localStorage.clear();
      router.replace("/login?reason=expired");
      return;
    }

    // Validar Rol permitido
    if (allowedRoles && !allowedRoles.includes(role)) {
      router.replace("/");
      return;
    }

    // Validar pertenencia a Sucursal o Restaurante (Solo si hay un ID en la URL y no es SuperAdmin)
    if (params?.id && role !== "1") {
      
      // Lógica para Gerente (Rol 2): Valida contra id_res
      if (role === "2") {
        if (String(idResUser) !== String(params.id)) {
          console.error("Acceso denegado: Gerente pertenece a restaurante", idResUser, "no a", params.id);
          router.replace("/");
          return;
        }
      } 
      //Lógica para Staff (Otros roles): Valida contra id_local
      else {
        if (String(idLocalUser) !== String(params.id)) {
          console.error("Acceso no autorizado: Usuario sucursal", idLocalUser, "intentó entrar a", params.id);
          router.replace("/"); 
          return;
        }
      }
    }

    setChecking(false);
  }, [params?.id, allowedRoles, router]);

  return checking;
}