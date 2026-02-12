
import { X, Gift, Calendar } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  local: any;
  promociones: any[];
  loading: boolean;
}

export default function PromocionesActivasModal({
  isOpen,
  onClose,
  local,
  promociones,
  loading,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-2xl">
              <Gift className="text-orange-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Promociones Activas
              </h2>
              <p className="text-sm text-gray-500">
                {local?.detalle || "Sucursal"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : promociones.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No hay promociones activas en este momento
            </div>
          ) : (
            <div className="space-y-4">
              {promociones.map((promo) => (
                <div
                  key={promo.id}
                  className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">
                        {promo.nombre}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {promo.descripcion}
                      </p>
                    </div>
                    <span className="text-2xl font-black text-orange-600">
                      -{promo.descuento}%
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        {promo.fec_inicio} → {promo.fec_fin}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}