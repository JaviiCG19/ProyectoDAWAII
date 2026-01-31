from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class LocalService:
    @staticmethod
    def listar_locales():
        # Filtramos para mostrar solo los locales "activos"
        query = "SELECT id, idcia, detalle, direccion, totmesas FROM dawa.locales WHERE fecact IS NOT NULL ORDER BY id"
        return DataBaseHandle.getRecords(query, 0)

    @staticmethod
    def obtener_local_por_id(id_local):
        query = "SELECT id, idcia, detalle, direccion, totmesas FROM dawa.locales WHERE id = %s"
        return DataBaseHandle.getRecords(query, 1, (id_local,))

    @staticmethod
    def crear_local(data):
        # Agregamos RETURNING id para que pueda vincular el usuario al local creado
        query = """
            INSERT INTO dawa.locales (idcia, detalle, direccion, totmesas, fecact)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        """
        record = (data['idcia'], data['detalle'], data['direccion'], data.get('totmesas', 1), datetime.now())
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def actualizar_local(id_local, data):
        query = """
            UPDATE dawa.locales 
            SET idcia=%s, detalle=%s, direccion=%s, totmesas=%s, fecact=%s
            WHERE id = %s
        """
        record = (data['idcia'], data['detalle'], data['direccion'], data.get('totmesas', 1), datetime.now(), id_local)
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def eliminar_local(id_local):
        # Borrado lógico
        query = "UPDATE dawa.locales SET fecact = NULL WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (id_local,))

    @staticmethod
    def restaurar_local(id_local):
        query = "UPDATE dawa.locales SET fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_local))