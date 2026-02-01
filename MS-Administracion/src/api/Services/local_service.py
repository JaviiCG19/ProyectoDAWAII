from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime


class LocalService:
    @staticmethod
    def listar_por_empresa(id_cia):
        query = """
                SELECT id, idcia, detalle, direccion, totmesas
                FROM dawa.locales
                WHERE idcia = %s \
                  AND estado = 1
                ORDER BY id
                """
        return DataBaseHandle.getRecords(query, (id_cia,))

    @staticmethod
    def obtener_local_por_id(id_local):
        query = "SELECT id, idcia, detalle, direccion, totmesas FROM dawa.locales WHERE id = %s"
        return DataBaseHandle.getRecords(query, 1, (id_local,))

    @staticmethod
    def crear_local(data):
        """
        Crea el local y automatiza la creación de mesas
        """
        try:
            query_local = """
                          INSERT INTO dawa.locales (idcia, detalle, direccion, totmesas, fecact, estado)
                          VALUES (%s, %s, %s, %s, %s, 1) RETURNING id
                          """
            record_local = (data['idcia'], data['detalle'], data['direccion'], data['totmesas'], datetime.now())
            res_local = DataBaseHandle.ExecuteNonQuery(query_local, record_local)

            if res_local['result']:
                # AUTOMATIZACIÓN: Generamos las mesas ms-1, ms-2... hasta el total indicado
                LocalService.sincronizar_mesas(res_local['id'], data['totmesas'])

            return res_local
        except Exception as e:
            return {"result": False, "message": str(e)}

    @staticmethod
    def actualizar_local(id_local, data):
        """
        Actualiza el local y sincroniza el stock de mesas (crea nuevas o desactiva sobrantes).
        """
        try:
            query = """
                    UPDATE dawa.locales
                    SET idcia=%s, \
                        detalle=%s, \
                        direccion=%s, \
                        totmesas=%s, \
                        fecact=%s
                    WHERE id = %s
                    """
            record = (data['idcia'], data['detalle'], data['direccion'], data['totmesas'], datetime.now(), id_local)
            res = DataBaseHandle.ExecuteNonQuery(query, record)

            if res['result']:
                # Sincronizamos las mesas para que coincidan con el nuevo totmesas
                LocalService.sincronizar_mesas(id_local, data['totmesas'])
            return res
        except Exception as e:
            return {"result": False, "message": str(e)}

    @staticmethod
    def sincronizar_mesas(id_local, nuevo_total):
        """
        LÓGICA DE AUTOMATIZACIÓN (Formato ms-1, ms-2...):
        - Si nuevo_total > actuales: Crea las que faltan.
        - Ajusta estados: Activa las que están en rango, desactiva (estado 0) las sobrantes.
        """
        nuevo_total = int(nuevo_total)

        # Contamos cuántas mesas existen históricamente para este local
        query_check = "SELECT COUNT(*) as total FROM dawa.mesas WHERE idlocal = %s"
        res_check = DataBaseHandle.getRecords(query_check, (id_local,))
        actuales = res_check[0]['total'] if res_check else 0

        # CREACIÓN: Si el usuario quiere más mesas de las que hay en DB, se crean
        if nuevo_total > actuales:
            for i in range(actuales + 1, nuevo_total + 1):
                identificador = f"ms-{i}"  # Formato ms-1, ms-2...
                query_ins = """
                            INSERT INTO dawa.mesas (idlocal, numero, maxper, estado, fecact)
                            VALUES (%s, %s, 4, 1, %s) \
                            """
                DataBaseHandle.ExecuteNonQuery(query_ins, (id_local, identificador, datetime.now()))

        # SINCRONIZACIÓN DE ESTADOS :
        # Activamos las mesas dentro del rango ms-1 hasta ms-{nuevo_total}
        query_act = """
                    UPDATE dawa.mesas \
                    SET estado = 1, \
                        fecact = %s
                    WHERE idlocal = %s \
                      AND CAST(SPLIT_PART(numero, '-', 2) AS INTEGER) <= %s \
                    """
        DataBaseHandle.ExecuteNonQuery(query_act, (datetime.now(), id_local, nuevo_total))

        # Desactivamos (estado 0) las mesas que superan el total (ms-41, ms-42...)
        query_des = """
                    UPDATE dawa.mesas \
                    SET estado = 0, \
                        fecact = %s
                    WHERE idlocal = %s \
                      AND CAST(SPLIT_PART(numero, '-', 2) AS INTEGER) > %s \
                    """
        DataBaseHandle.ExecuteNonQuery(query_des, (datetime.now(), id_local, nuevo_total))

    @staticmethod
    def eliminar_local(id_local):

        now = datetime.now()
        DataBaseHandle.ExecuteNonQuery("UPDATE dawa.locales SET estado = 0, fecact = %s WHERE id = %s", (now, id_local))
        return DataBaseHandle.ExecuteNonQuery("UPDATE dawa.mesas SET estado = 0, fecact = %s WHERE idlocal = %s",
                                              (now, id_local))

    @staticmethod
    def restaurar_local(id_local):
        """Restaura el local y reactiva sus mesas según su totmesas."""
        now = datetime.now()
        res = DataBaseHandle.ExecuteNonQuery("UPDATE dawa.locales SET estado = 1, fecact = %s WHERE id = %s",
                                             (now, id_local))

        query_info = "SELECT totmesas FROM dawa.locales WHERE id = %s"
        info = DataBaseHandle.getRecords(query_info, (id_local,))
        if info:
            LocalService.sincronizar_mesas(id_local, info[0]['totmesas'])
        return res