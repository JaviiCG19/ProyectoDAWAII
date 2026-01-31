"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut, ChefHat, ShieldCheck, Briefcase, ClipboardList, Utensils  } from "lucide-react";
import { logoutService } from "@/services/auth.service";
import Link from "next/link";
import { usePathname } from "next/navigation";



export default function Navbar() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const pathname = usePathname();


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuth(false);
      setUserName("");
      setRole("");
      return;
    }

    setIsAuth(true);

    const name = localStorage.getItem("user_name");
    const currentRole = localStorage.getItem("current_role");

    setUserName(name || "");
    setRole(getRoleName(currentRole || ""));
  }, [pathname]);



  if (isAuth === null) return null; // evita los parpadeos

  return (
    <header className="bg-[#dc902b] text-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">

        <div className="flex items-center gap-2 text-xl font-bold cursor-default">
          <ChefHat size={26} />
          ReservasRest
        </div>

     
        <div className="flex items-center gap-4">
          {isAuth && (
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
              

              <div className="bg-white/20 p-2 rounded-full">
                {getRoleIcon(role)}
              </div>

             
              <div className="leading-tight">
                <div className="text-xs text-white/80">
                  Bienvenido,
                </div>
                <div className="font-semibold text-sm text-white">
                  {userName}
                </div>
                <div className="text-xs text-white/80">
                  Has iniciado sesión como{" "}
                  <span className="font-medium text-white">
                    {role}
                  </span>
                </div>
              </div>

            </div>
          )}


          {!isAuth ? (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-white text-[#dc902b] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <LogIn size={18} />
              Iniciar sesión
            </Link>
          ) : (
            <button
              onClick={logoutService}
              className="flex items-center gap-2 bg-white text-[#dc902b] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

/* Indicadores */
function getRoleName(role?: string) {
  switch (role) {
    case "1":
      return "Administrador";
    case "2":
      return "Gerente";
    case "3":
      return "Recepcionista";
    case "4":
      return "Mesero";
    default:
      return "";
  }
}
/* Indicadores Iconos*/
function getRoleIcon(role?: string) {
  const size = 18;

  switch (role) {
    case "Administrador":
      return <ShieldCheck size={size} />;
    case "Gerente":
      return <Briefcase size={size} />;
    case "Recepcionista":
      return <ClipboardList size={size} />;
    case "Mesero":
      return <Utensils size={size} />;
    default:
      return <ChefHat size={size} />;
  }
}
