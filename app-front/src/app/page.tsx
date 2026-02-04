import Image from "next/image";
import Link from "next/link"; 
import {
  Store,
  LayoutGrid,
  Clock,
  CalendarCheck,
  BarChart3,
} from "lucide-react";

import gestionImg from "@/img/gestion-restaurantes.png";

const features = [
  {
    title: "Gestión de Restaurantes",
    description: "Administra múltiples restaurantes desde una sola plataforma.",
    icon: Store,
  },
  {
    title: "Sucursales y Mesas",
    description: "Control total de sucursales, mesas y capacidades.",
    icon: LayoutGrid,
  },
  {
    title: "Horarios de Atención",
    description: "Configura horarios y disponibilidad de forma flexible.",
    icon: Clock,
  },
  {
    title: "Reservas Inteligentes",
    description: "Evita sobre-reservas y mejora la experiencia del cliente.",
    icon: CalendarCheck,
  },
  {
    title: "Dashboard de Ocupación",
    description: "Visualiza la ocupación y toma mejores decisiones.",
    icon: BarChart3,
  },
];

export default function HomePage() {
  return (
    <section className="space-y-16">

      <div className="text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#F2B847]">
          Sistema de Gestión de Reservas para Restaurantes
        </h2>

        <p className="text-lg max-w-3xl mx-auto text-gray-700">
          Somos una aplicación web diseñada para optimizar la gestión de
          reservas, mesas, horarios y sucursales, mejorando la eficiencia
          operativa de restaurantes.
        </p>

        <div className="flex justify-center">
          <Image
            src={gestionImg}
            alt="Gestión de múltiples restaurantes"
            className="rounded-2xl shadow-md max-w-2xl w-full"
            priority
          />
        </div>
      </div>

  
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          // Tarjeta de Dashboard ya tiene enlace
          if (feature.title === "Dashboard de Ocupación") {
            return (
              <Link key={index} href="/reservas/dashboard">
                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-[#FDF3D8] text-[#F2B847]">
                      <Icon size={28} />
                    </div>

                    <h3 className="text-xl font-semibold text-[#F2B847]">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </Link>
            );
          }

          // Las demás tarjetas sin enlace 
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-[#FDF3D8] text-[#F2B847]">
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-semibold text-[#F2B847]">
                  {feature.title}
                </h3>
              </div>

              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}