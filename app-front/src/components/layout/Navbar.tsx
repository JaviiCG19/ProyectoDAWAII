"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-[#dc902b] text-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          ReservasRest
        </h1>

        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-white text-[#dc902b] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Iniciar sesión
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
