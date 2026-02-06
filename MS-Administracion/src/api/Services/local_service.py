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

        # CORRECCIÓN: Usamos res.get('data') porque ahí viaja el ID del RETURNING
        if res.get('result') and res.get('data'):
            # A veces RETURNING devuelve una lista o un valor directo
            # Forzamos a que sea el valor simple
            raw_id = res.get('data')
            id_generado = raw_id[0] if isinstance(raw_id, (list, tuple)) else raw_id

            LocalService._sincronizar_mesas(id_generado, int(data.get('totmesas', 0)))

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
        try:
            # 1. Traer las mesas actuales (activas e inactivas)
            query_check = "SELECT id, estado FROM dawa.mesas WHERE idlocal = %s ORDER BY id ASC"
            mesas_db = DataBaseHandle.getRecords(query_check, 0, (id_local,))['data']
            total_actual = len(mesas_db)  # Cuántas hay físicamente en la DB

            # --- CASO A: Necesitamos más mesas de las que tenemos en total ---
            if nuevo_total > total_actual:
                # 1. Primero activamos TODAS las que ya existen (por si estaban en estado 0)
                query_upd = "UPDATE dawa.mesas SET estado = 1 WHERE idlocal = %s"
                DataBaseHandle.ExecuteNonQuery(query_upd, (id_local,))

                # 2. Creamos SOLO las que realmente faltan para llegar al nuevo_total
                faltantes = nuevo_total - total_actual
                for i in range(1, faltantes + 1):
                    nro_mesa = f"ms-{total_actual + i}"  # El número sigue la secuencia
                    query_ins = "INSERT INTO dawa.mesas (idlocal, numero, maxper, estado, fecact) VALUES (%s, %s, 2, 1, %s)"
                    DataBaseHandle.ExecuteNonQuery(query_ins, (id_local, nro_mesa, datetime.now().date()))

            # --- CASO B: Queremos menos mesas de las que hay (Borrado Lógico) ---
            elif nuevo_total < total_actual:
                # Ponemos en estado 1 solo las que queremos ver
                # Y el resto las mandamos a estado 0
                # (Este enfoque es más seguro que el LIMIT en el UPDATE)
                for index, mesa in enumerate(mesas_db):
                    nuevo_estado = 1 if index < nuevo_total else 0
                    query_estado = "UPDATE dawa.mesas SET estado = %s WHERE id = %s"
                    DataBaseHandle.ExecuteNonQuery(query_estado, (nuevo_estado, mesa['id']))

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