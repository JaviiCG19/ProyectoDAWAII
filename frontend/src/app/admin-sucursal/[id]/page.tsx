"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/services/useAuth";
import { useEffect, useState, useCallback } from "react";
import { 
  getFranjasByLocal, 
  getPromocionesByLocal, 
  deleteFranja, 
  deletePromocion 
} from "@/services/admin-sucursal.service";
import { Franja, Promocion } from "@/interface/admin.interface";
import { Clock, Tag, Calendar, Plus, Trash2, Edit3, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Modales de Gestión 
import ModalFranja from "@/components/modals/ModalFranja";
import ModalPromocion from "@/components/modals/ModalPromocion";

// Modales de Papelera 
import ModalPapeleraFranja from "@/components/modals/ModalPapeleraFranja";
import ModalPapeleraPromocion from "@/components/modals/ModalPapeleraPromocion";

export default function AdminSucursalPage() {
  const params = useParams();
  const localId = params?.id as string;
  const checking = useAuth(["3"]);

  const [franjas, setFranjas] = useState<Franja[]>([]);
  const [promos, setPromos] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);


  const [modalFranja, setModalFranja] = useState({ open: false, data: null as Franja | null });
  const [modalPromo, setModalPromo] = useState({ open: false, data: null as Promocion | null });


  const [showPapeleraFranja, setShowPapeleraFranja] = useState(false);
  const [showPapeleraPromo, setShowPapeleraPromo] = useState(false);

  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const loadData = useCallback(() => {
    if (localId) {
      setLoading(true);
      Promise.all([
        getFranjasByLocal(localId),
        getPromocionesByLocal(localId)
      ]).then(([dataFranjas, dataPromos]) => {
        setFranjas(dataFranjas);
        setPromos(dataPromos);
        setLoading(false);
      }).catch(err => {
        console.error("Error cargando datos:", err);
        setLoading(false);
      });
    }
  }, [localId]);

  useEffect(() => {
    if (!checking) loadData();
  }, [checking, loadData]);

  const handleDeleteFranja = async (id: number) => {
    if (confirm("¿Mover esta franja a la papelera?")) {
      await deleteFranja(id);
      loadData();
    }
  };

  const handleDeletePromo = async (id: number) => {
    if (confirm("¿Mover esta promoción a la papelera?")) {
      await deletePromocion(id);
      loadData();
    }
  };

  if (checking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Cargando configuración del local...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
   
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/locales" className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-800">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">Administración de Sucursal</h1>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Gestionando Local #{localId}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                <Clock size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Franjas Horarias</h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowPapeleraFranja(true)}
                className="p-3 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all"
                title="Ver papelera"
              >
                <Trash2 size={20} />
              </button>
              <button 
                onClick={() => setModalFranja({ open: true, data: null })}
                className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-gray-200 hover:shadow-orange-100"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid gap-3">
            {franjas.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400">
                No hay franjas configuradas
              </div>
            ) : (
              franjas.map(f => (
                <div key={f.id} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                  <div>
                    <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                      {dias[f.diasem]}
                    </span>
                    <p className="mt-2 font-bold text-gray-800 text-lg">{f.horini} — {f.horfin}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button onClick={() => setModalFranja({ open: true, data: f })} className="text-blue-500 hover:bg-blue-50 p-2 rounded-xl transition-colors"><Edit3 size={18} /></button>
                    <button onClick={() => handleDeleteFranja(f.id!)} className="text-red-400 hover:bg-red-50 p-2 rounded-xl transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Tag size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Promociones</h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowPapeleraPromo(true)}
                className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                title="Ver papelera"
              >
                <Trash2 size={20} />
              </button>
              <button 
                onClick={() => setModalPromo({ open: true, data: null })}
                className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-gray-200 hover:shadow-blue-100"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {promos.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-400">
                No hay promociones activas
              </div>
            ) : (
              promos.map(p => (
                <div key={p.id} className="p-5 border border-gray-100 rounded-3xl bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group relative overflow-hidden">
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg leading-tight mb-1">{p.nombre}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2 max-w-[80%]">{p.descripcion}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-2xl font-black text-blue-600">-{p.descuento}%</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                         <button onClick={() => setModalPromo({ open: true, data: p })} className="text-blue-500 p-2 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={16} /></button>
                         <button onClick={() => handleDeletePromo(p.id!)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-[11px] font-bold text-gray-400 border-t border-gray-50 pt-4 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-400"/> {p.fec_inicio}</span>
                    <span className="text-gray-300">/</span>
                    <span className="flex items-center gap-1.5">{p.fec_fin}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <ModalFranja 
        isOpen={modalFranja.open} 
        idLocal={parseInt(localId)}
        selectedData={modalFranja.data}
        onClose={() => setModalFranja({ open: false, data: null })}
        onSuccess={loadData}
      />

      <ModalPromocion 
        isOpen={modalPromo.open} 
        idLocal={parseInt(localId)}
        selectedData={modalPromo.data}
        onClose={() => setModalPromo({ open: false, data: null })}
        onSuccess={loadData}
      />

      <ModalPapeleraFranja 
        isOpen={showPapeleraFranja} 
        onClose={() => setShowPapeleraFranja(false)} 
        idLocal={localId} 
        onRestored={loadData} 
      />

      <ModalPapeleraPromocion 
        isOpen={showPapeleraPromo} 
        onClose={() => setShowPapeleraPromo(false)} 
        idLocal={localId} 
        onRestored={loadData} 
      />
    </div>
  );
}