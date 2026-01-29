import {
  User,
  Lock,
  LogIn,
} from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-6">
        
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-[#F2B847]">
            Iniciar Sesión
          </h1>
          <p className="text-sm text-gray-600">
            Accede al sistema de gestión de reservas
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-4">
          
          {/* USERNAME */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Usuario
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Ingrese su usuario"
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#F2B847]"
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2
              bg-[#F2B847] text-white py-2.5 rounded-xl text-sm font-semibold
              hover:opacity-90 transition"
          >
            <LogIn size={18} />
            Ingresar
          </button>
        </form>

        {/* FOOTER LINK */}
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
