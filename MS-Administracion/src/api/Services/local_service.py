from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime


class LocalService:
    @staticmethod
    def listar_por_empresa(idcia):
        query = "SELECT id, idcia, detalle, direccion, totmesas FROM dawa.locales WHERE idcia = %s AND estado = 1 ORDER BY id"
        return DataBaseHandle.getRecords(query, 0, (idcia,))

    @staticmethod
    def obtener_local_por_id(id_local):
        query = "SELECT id, idcia, detalle, direccion, totmesas FROM dawa.locales WHERE id = %s"
        return DataBaseHandle.getRecords(query, 1, (id_local,))

    @staticmethod
    def crear_local(data):

        query = """
                INSERT INTO dawa.locales (idcia, detalle, direccion, totmesas, fecact, estado)
                VALUES (%s, %s, %s, %s, %s, 1) RETURNING id
                """
        record = (data['idcia'], data['detalle'], data['direccion'], data.get('totmesas', 0), datetime.now())
        res = DataBaseHandle.ExecuteNonQuery(query, record)

        if res.get('result') and res.get('id'):
            # Sincronizamos mesas (esto las creará por primera vez)
            LocalService._sincronizar_mesas(res['id'], int(data.get('totmesas', 0)))

        return res

    @staticmethod
    def actualizar_local(id_local, data):

        query = """
                UPDATE dawa.locales
                SET idcia=%s, \
                    detalle=%s, \
                    direccion=%s, \
                    totmesas=%s, \
                    fecact=%s
                WHERE id = %s \
                  AND estado = 1
                """
        nuevo_total = int(data.get('totmesas', 0))
        record = (data['idcia'], data['detalle'], data['direccion'], nuevo_total, datetime.now(), id_local)
        res = DataBaseHandle.ExecuteNonQuery(query, record)

        if res.get('result'):

            LocalService._sincronizar_mesas(id_local, nuevo_total)

        return res

    @staticmethod
    def _sincronizar_mesas(id_local, nuevo_total):
        """
        GESTIÓN INTELIGENTE: Crea si faltan, restaura si estaban borradas,
        y oculta (estado 0) si sobran.
        """
        try:
            # 1. Ver cuántas existen ya (activas o inactivas)
            query_check = "SELECT id, estado FROM dawa.mesas WHERE idlocal = %s ORDER BY id ASC"
            mesas_db = DataBaseHandle.getRecords(query_check, 0, (id_local,))['data']
            total_db = len(mesas_db)

            # CASO A: Se incrementó el total
            if nuevo_total > total_db:
                # Primero restauramos las que estén en estado 0
                for m in mesas_db:
                    if m['estado'] == 0:
                        DataBaseHandle.ExecuteNonQuery("UPDATE dawa.mesas SET estado = 1 WHERE id = %s", (m['id'],))

                # Si aún faltan (mesas nuevas), las creamos
                for i in range(total_db + 1, nuevo_total + 1):
                    nro_mesa = f"ms-{i}"
                    query_ins = "INSERT INTO dawa.mesas (idlocal, numero, maxper, estado, fecact) VALUES (%s, %s, 2, 1, %s)"
                    DataBaseHandle.ExecuteNonQuery(query_ins, (id_local, nro_mesa, datetime.now().date()))

            # CASO B: Se disminuyó el total (Borrado Lógico)
            elif nuevo_total < total_db:
                # Desactivamos las mesas que sobran (las últimas creadas)
                query_des = """
                            UPDATE dawa.mesas \
                            SET estado = 0
                            WHERE idlocal = %s \
                              AND id IN (SELECT id \
                                         FROM dawa.mesas \
                                         WHERE idlocal = %s \
                                           AND estado = 1 \
                                         ORDER BY id DESC \
                                LIMIT %s
                                ) \
                            """
                diferencia = total_db - nuevo_total
                if diferencia > 0:
                    DataBaseHandle.ExecuteNonQuery(query_des, (id_local, id_local, diferencia))
        except Exception as e:
            print(f"Error sincronizando mesas: {e}")

    @staticmethod
    def eliminar_local(id_local):
        query = "UPDATE dawa.locales SET estado = 0 WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (id_local,))

    @staticmethod
    def restaurar_local(id_local):
        query = "UPDATE dawa.locales SET estado = 1, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_local))

    @staticmethod
    def listar_eliminados_por_empresa(idcia):
        query = "SELECT id, idcia, detalle, direccion, totmesas FROM dawa.locales WHERE idcia = %s AND estado = 0 ORDER BY id"
        return DataBaseHandle.getRecords(query, 0, (idcia,))