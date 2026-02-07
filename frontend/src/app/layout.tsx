import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export const metadata: Metadata = {
  title: "Gestión de Reservas | Restaurante",
  description: "Sistema de gestión de reservas para restaurantes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#F5EFE6] text-gray-800 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 container mx-auto px-6 py-8">
            {children}
          </main>
          <Footer />
      </body>
    </html>
  );
}
