"use client";

import { useEffect, useState, useRef } from "react";
import {
  LogIn, LogOut, ChefHat, ShieldCheck, Briefcase, Utensils,
  Menu, Shuffle, KeyRound, Store, BellRing, ChevronRight, ArrowLeft, Check
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutService } from "@/services/auth.service";
import { getRedirectPathByRole } from "@/services/roleRedirect";
import ModalChangePassword from "@/components/modals/ModalChangePassword";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [allRoles, setAllRoles] = useState<string[]>([]); 
  const [openMenu, setOpenMenu] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuth(false);
      return;
    }

    const rolesRaw = localStorage.getItem("roles") || "";
    const activeRole = localStorage.getItem("current_role") || "";

    setIsAuth(true);
    setUserName(localStorage.getItem("user_name") || "");
    setCurrentRole(activeRole);

    if (rolesRaw) {
      const cleanedRoles = rolesRaw
        .replace(/["']/g, "") 
        .split(";")
        .map(r => r.trim())
        .filter(Boolean);

      setAllRoles(cleanedRoles);
    }
  }, [pathname]);

  const handleRoleChange = (newRole: string) => {
    if (newRole === currentRole) {
      setOpenMenu(false);
      setShowRoleSelector(false);
      return;
    }

    const idLocal = localStorage.getItem("id_local");
    const idRes = localStorage.getItem("id_res");

    localStorage.setItem("current_role", newRole);
    setCurrentRole(newRole); 
    
    setOpenMenu(false);
    setShowRoleSelector(false);

    const targetPath = getRedirectPathByRole(
      newRole,
      idLocal ? Number(idLocal) : null,
      idRes ? Number(idRes) : null
    );

    router.replace(targetPath);
  };

  if (isAuth === null) return null;

  return (
    <>
      <header className="bg-[#dc902b] text-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <ChefHat size={26} />
            ReservasRest
          </Link>

          <div className="flex items-center gap-4 relative" ref={menuRef}>
            {isAuth && (
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                <div className="bg-white/20 p-2 rounded-full">
                  {getRoleIcon(currentRole)}
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Sesión</div>
                  <div className="font-semibold text-sm leading-none mb-1">{userName}</div>
                  <div className="text-[11px] bg-black/20 px-1.5 py-0.5 rounded inline-block">
                    {getRoleName(currentRole)}
                  </div>
                </div>
              </div>
            )}

            {!isAuth ? (
              <Link href="/login" className="flex items-center gap-2 bg-white text-[#dc902b] px-4 py-2 rounded-lg font-semibold shadow-sm">
                <LogIn size={18} /> Iniciar sesión
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="bg-white text-[#dc902b] p-3 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  <Menu size={20} />
                </button>

                {openMenu && (
                  <div className="absolute right-0 top-full mt-3 w-64 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="absolute -top-2 right-5 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200" />

                    <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden text-gray-700">
                      
                      {!showRoleSelector ? (
                        <div className="py-2">
                          <button
                            onClick={() => setShowRoleSelector(true)}
                            className="w-full flex items-center gap-4 px-5 py-4 text-sm hover:bg-orange-50 transition-colors"
                          >
                            <Shuffle size={18} className="text-blue-500" />
                            <div className="flex flex-col items-start">
                              <span className="font-bold">Cambiar de rol</span>
                              <span className="text-[10px] text-gray-400">Ver todos tus roles</span>
                            </div>
                            <ChevronRight size={16} className="ml-auto text-gray-300" />
                          </button>

                          <button
                            onClick={() => { setOpenMenu(false); setOpenChangePassword(true); }}
                            className="w-full flex items-center gap-4 px-5 py-4 text-sm hover:bg-orange-50 transition-colors"
                          >
                            <KeyRound size={18} className="text-orange-600" />
                            <span className="font-bold">Contraseña</span>
                          </button>

                          <div className="h-px bg-gray-100 my-1" />

                          <button
                            onClick={logoutService}
                            className="w-full flex items-center gap-4 px-5 py-4 text-sm text-red-600 hover:bg-red-50 transition-colors font-bold"
                          >
                            <LogOut size={18} />
                            Cerrar sesión
                          </button>
                        </div>
                      ) : (
                        /* SELECTOR DE ROLES */
                        <>
                          <div className="px-4 py-4 border-b flex items-center gap-3 bg-gray-50">
                            <button 
                              onClick={() => setShowRoleSelector(false)}
                              className="p-1.5 hover:bg-white rounded-full shadow-sm transition-all"
                            >
                              <ArrowLeft size={16} className="text-gray-600" />
                            </button>
                            <span className="text-xs text-gray-500 uppercase font-black tracking-widest">Mis Roles</span>
                          </div>
                          
                          <div className="max-h-72 overflow-y-auto">
                            {allRoles.map((roleID) => (
                              <button
                                key={roleID}
                                onClick={() => handleRoleChange(roleID)}
                                className={`w-full flex items-center gap-4 px-5 py-4 text-sm transition-all border-b border-gray-50 last:border-0 ${
                                  currentRole === roleID 
                                  ? 'bg-orange-50/50 cursor-default' 
                                  : 'hover:bg-blue-50'
                                }`}
                              >
                                <div className={`${currentRole === roleID ? 'text-[#dc902b]' : 'text-blue-500'}`}>
                                  {getRoleIcon(roleID)}
                                </div>
                                <span className={`font-bold ${currentRole === roleID ? 'text-[#dc902b]' : 'text-gray-700'}`}>
                                  {getRoleName(roleID)}
                                </span>
                                {currentRole === roleID && (
                                  <Check size={14} className="ml-auto text-[#dc902b]" />
                                )}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
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
        onSuccess={() => { setOpenChangePassword(false); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000); }}
      />

      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-60 flex items-center gap-3 font-bold animate-bounce">
          <Check size={20} /> Contraseña actualizada
        </div>
      )}
    </>
  );
}

function getRoleName(roleID?: string) {
  const cleanID = String(roleID).replace(/[;'"\s]/g, "");
  switch (cleanID) {
    case "1": return "Administrador";
    case "2": return "Gerente";
    case "3": return "Admin Sucursal";
    case "4": return "Recepcionista";
    case "5": return "Mesero";
    default: return "Rol " + cleanID;
  }
}

function getRoleIcon(roleID?: string) {
  const cleanID = String(roleID).replace(/[;'"\s]/g, "");
  const size = 18;
  switch (cleanID) {
    case "1": return <ShieldCheck size={size} />;
    case "2": return <Briefcase size={size} />;
    case "3": return <Store size={size} />;
    case "4": return <BellRing size={size} />;
    case "5": return <Utensils size={size} />;
    default: return <ChefHat size={size} />;
  }
}