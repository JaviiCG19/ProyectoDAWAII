"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginService } from "@/services/auth.service";
import { getRedirectPathByRole } from "@/services/roleRedirect";
import { User, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginService({
        login_user: user,
        login_password: pass,
      });

      //expiración tokend
      const expiresAt = Date.now() + 15 * 60 * 1000;

      //guardar sesión
      localStorage.setItem("token", data.token);
      localStorage.setItem("token_exp", String(expiresAt));
      localStorage.setItem("primary_role", String(data.primary_role));
      localStorage.setItem("current_role", String(data.primary_role));
      localStorage.setItem("roles", JSON.stringify(data.roles));
      localStorage.setItem("user_name", data.user_name);

      //redirección por rol
      router.replace(getRedirectPathByRole(String(data.primary_role)));
    } catch (error) {
      alert("Credenciales inválidas");
    }
  };

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("primary_role");

    if (token && role) {
      router.replace(getRedirectPathByRole(role));
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-6">

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-[#F2B847]">
            Iniciar Sesión
          </h1>
          <p className="text-sm text-gray-600">
            Accede al sistema de gestión de reservas
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Usuario
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ingrese su usuario"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#F2B847] text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            <LogIn size={18} />
            Ingresar
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-[#F2B847] hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

      </div>
    </div>
  );
}
