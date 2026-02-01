from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime


class DashboardService:
    @staticmethod
    def obtener_resumen(id_cia):
        """
        CORRECCIÓN:
        Filtramos todas las subconsultas por 'idcia' para que el Gerente vea
        solo la data consolidada de sus sucursales.
        """
        try:
            # Aquí se cuenta el inventario real de mesas, locales y promociones
            # vinculando cada entidad a la empresa dueña (idcia).
            query = """
                    SELECT (SELECT COUNT(*) FROM dawa.locales WHERE idcia = %s) as totales_locales, \
                           (SELECT COUNT(*) \
                            FROM dawa.mesas m \
                                     INNER JOIN dawa.locales l ON m.idlocal = l.id \
                            WHERE l.idcia = %s \
                              AND m.estado = 0)as mesas_disponibles, \
                           (SELECT COUNT(*) \
                            FROM dawa.promociones p \
                                     INNER JOIN dawa.locales l ON p.idlocal = l.id \
                            WHERE l.idcia = %s \
                              AND p.estado = 1) as promociones_vigentes, \
                           (SELECT COUNT(*) \
                            FROM dawa.reservas r \
                                     INNER JOIN dawa.locales l ON r.idlocal = l.id \
                            WHERE l.idcia = %s \
                              AND r.fecha = CURRENT_DATE) as reservas_para_hoy \
                    """

            # Valoramos el idcia que viene del token/front en cada consulta interna
            params = (id_cia, id_cia, id_cia, id_cia)
            return DataBaseHandle.getRecords(query, 1, params)

        except Exception as e:
            return {"result": False, "message": f"Error de consolidación: {str(e)}"}