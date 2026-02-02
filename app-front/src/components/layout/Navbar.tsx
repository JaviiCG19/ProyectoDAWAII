"use client";

import { useEffect, useState, useRef } from "react";
import {
  LogIn,
  LogOut,
  ChefHat,
  ShieldCheck,
  Briefcase,
  ClipboardList,
  Utensils,
  Menu,
  Shuffle,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutService } from "@/services/auth.service";
import ModalChangePassword from "@/components/modals/ModalChangePassword";

export default function Navbar() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuth(false);
      return;
    }

    setIsAuth(true);
    setUserName(localStorage.getItem("user_name") || "");
    setRole(getRoleName(localStorage.getItem("current_role") || ""));
  }, [pathname]);

  //cerrar menú al click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    }

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  if (isAuth === null) return null;

  return (
    <>
      <header className="bg-[#dc902b] text-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-2 text-xl font-bold">
            <ChefHat size={26} />
            ReservasRest
          </div>

          <div className="flex items-center gap-4 relative" ref={menuRef}>
            {isAuth && (
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl">
                <div className="bg-white/20 p-2 rounded-full">
                  {getRoleIcon(role)}
                </div>
                <div className="leading-tight">
                  <div className="text-xs text-white/80">Bienvenido</div>
                  <div className="font-semibold text-sm">{userName}</div>
                  <div className="text-xs text-white/80">
                    Rol: <span className="font-medium">{role}</span>
                  </div>
                </div>
              </div>
            )}

            {!isAuth ? (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-white text-[#dc902b] px-4 py-2 rounded-lg font-semibold"
              >
                <LogIn size={18} />
                Iniciar sesión
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="bg-white text-[#dc902b] p-3 rounded-full shadow-md"
                >
                  <Menu size={20} />
                </button>

                {openMenu && (
                  <div className="absolute right-0 top-full mt-3 w-64 z-50">
                    <div className="absolute -top-2 right-5 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200" />

                    <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
                      <div className="px-5 py-4 border-b text-xs text-gray-400 uppercase">
                        Sesión activa
                      </div>

                      <button
                        disabled
                        className="w-full flex items-center gap-4 px-5 py-3 text-sm text-gray-400 cursor-not-allowed"
                      >
                        <Shuffle size={16} />
                        Cambio de rol
                        <span className="ml-auto text-[10px]">Próx.</span>
                      </button>

                      <button
                        onClick={() => {
                          setOpenMenu(false);
                          setOpenChangePassword(true);
                        }}
                        className="w-full flex items-center gap-4 px-5 py-3 text-sm text-gray-700 hover:bg-orange-50"
                      >
                        <KeyRound size={16} className="text-orange-600" />
                        Cambiar contraseña
                      </button>

                      <div className="h-px bg-gray-100 mx-5 my-2" />

                      <button
                        onClick={logoutService}
                        className="w-full flex items-center gap-4 px-5 py-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </nav>
      </header>

      
      <ModalChangePassword
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        onSuccess={() => {
          setOpenChangePassword(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }}
      />


      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
          Contraseña actualizada correctamente
        </div>
      )}
    </>
  );
}


function getRoleName(role?: string) {
  switch (role) {
    case "1": return "Administrador";
    case "2": return "Gerente";
    case "3": return "Recepcionista";
    case "4": return "Mesero";
    default: return "";
  }
}


function getRoleIcon(role?: string) {
  const size = 18;
  switch (role) {
    case "Administrador": return <ShieldCheck size={size} />;
    case "Gerente": return <Briefcase size={size} />;
    case "Recepcionista": return <ClipboardList size={size} />;
    case "Mesero": return <Utensils size={size} />;
    default: return <ChefHat size={size} />;
  }
}
