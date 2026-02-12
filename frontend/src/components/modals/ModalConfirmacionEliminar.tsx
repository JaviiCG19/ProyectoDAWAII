"use client";


interface ModalConfirmacionEliminarProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo?: string;
  mensaje?: string;
  loading?: boolean;
}

export default function ModalConfirmacionEliminar({
  isOpen,
  onClose,
  onConfirm,
  titulo = "¿Eliminar cliente?",
  mensaje = "Esta acción no se puede deshacer. El cliente será eliminado permanentemente.",
  loading = false,
}: ModalConfirmacionEliminarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{titulo}</h3>
          <p className="text-gray-600 mb-6">{mensaje}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Sí, eliminar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}