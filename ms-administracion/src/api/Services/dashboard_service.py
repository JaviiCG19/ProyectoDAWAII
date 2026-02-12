from ...utils.database.connection_db import DataBaseHandle


class DashboardService:
    @staticmethod
    def obtener_resumen(id_cia=None):
        """
        Servicio adaptativo para los 3 roles:
        - Si id_cia es None/Null: Resumen Global para Administrador y Gerente
        - Si id_cia tiene valor: Resumen por Local para Admin Sucursal
        """
        try:
            # CASO GLOBAL (Rol 1 y 2): Si el id_cia no viene o es nulo
            if not id_cia or id_cia == 'null' or id_cia == '0' or id_cia == '':
                query = """
                        SELECT (SELECT COUNT(*) FROM dawa.locales WHERE estado = 1)            as locales, \
                               (SELECT COUNT(*) FROM dawa.mesas WHERE estado = 0)              as mesas_disponibles, \
                               (SELECT COUNT(*) FROM dawa.promociones WHERE estado = 1)        as promos_activas, \
                               (SELECT COUNT(*) FROM dawa.reservas WHERE fecha = CURRENT_DATE) as reservas_hoy, \
                               (SELECT COUNT(*) FROM dawa.empresas WHERE estado = 1)           as empresas_activas \
                        """
                # Retorna un solo objeto con los totales de toda la red
                return DataBaseHandle.getRecords(query, 1)

            # CASO FILTRADO (Rol 3): Tu consulta original para el dueño del local
            else:
                query = """
                        SELECT (SELECT COUNT(*) FROM dawa.locales WHERE idcia = %s) as locales, \
                               (SELECT COUNT(*) \
                                FROM dawa.mesas m \
                                         INNER JOIN dawa.locales l ON m.idlocal = l.id \
                                WHERE l.idcia = %s \
                                  AND m.estado = 0)                                 as mesas_disponibles, \
                               (SELECT COUNT(*) \
                                FROM dawa.promociones p \
                                         INNER JOIN dawa.locales l ON p.idlocal = l.id \
                                WHERE l.idcia = %s \
                                  AND p.estado = 1)                                 as promos_activas, \
                               (SELECT COUNT(*) \
                                FROM dawa.reservas r \
                                         INNER JOIN dawa.locales l ON r.idlocal = l.id \
                                WHERE l.idcia = %s \
                                  AND r.fecha = CURRENT_DATE)                       as reservas_hoy \
                        """
                # Pasamos el id_cia a cada subquery
                params = (id_cia, id_cia, id_cia, id_cia)
                return DataBaseHandle.getRecords(query, 1, params)

        except Exception as e:
            return {"result": False, "message": str(e)}