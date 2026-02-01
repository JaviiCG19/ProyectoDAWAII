from ...utils.database.connection_db import DataBaseHandle

class DashboardService:
    @staticmethod
    def obtener_resumen(id_cia): # Recibimos el filtro
        try:
            query = """
                SELECT 
                    (SELECT COUNT(*) FROM dawa.locales WHERE idcia = %s) as locales,
                    (SELECT COUNT(*) FROM dawa.mesas m 
                     INNER JOIN dawa.locales l ON m.idlocal = l.id 
                     WHERE l.idcia = %s AND m.estado = 0) as mesas_disponibles,
                    (SELECT COUNT(*) FROM dawa.promociones p 
                     INNER JOIN dawa.locales l ON p.idlocal = l.id 
                     WHERE l.idcia = %s AND p.estado = 1) as promos_activas,
                    (SELECT COUNT(*) FROM dawa.reservas r 
                     INNER JOIN dawa.locales l ON r.idlocal = l.id 
                     WHERE l.idcia = %s AND r.fecha = CURRENT_DATE) as reservas_hoy
            """
            # Pasamos el id_cia a cada subquery
            params = (id_cia, id_cia, id_cia, id_cia)
            return DataBaseHandle.getRecords(query, 1, params)
        except Exception as e:
            return {"result": False, "message": str(e)}