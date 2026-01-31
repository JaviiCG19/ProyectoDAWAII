from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class MesaService:
    @staticmethod
    def listar_por_local(id_local):
        # Implementa el aislamiento de datos por sucursal
        query = "SELECT id, numero, maxper, estado FROM dawa.mesas WHERE idlocal = %s AND estado != 9 ORDER BY numero"
        return DataBaseHandle.getRecords(query, 0, (id_local,))

    @staticmethod
    def obtener_por_id(id_mesa):
        query = "SELECT id, idlocal, numero, maxper, estado FROM dawa.mesas WHERE id = %s"
        return DataBaseHandle.getRecords(query, 1, (id_mesa,))

    @staticmethod
    def crear_mesa(data):
        # Agregamos RETURNING id para facilitar la gestión en el frontend de Kioz
        query = """
            INSERT INTO dawa.mesas (idlocal, numero, maxper, estado, fecact)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        """
        # Estado 0 = Disponible
        record = (data['idlocal'], data['numero'], data.get('maxper', 2), 0, datetime.now())
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def actualizar_mesa(id_mesa, data):
        # Mantenemos la actualización vinculada al ID único de la mesa
        query = """
            UPDATE dawa.mesas 
            SET numero = %s, maxper = %s, fecact = %s 
            WHERE id = %s
        """
        record = (data['numero'], data.get('maxper', 2), datetime.now(), id_mesa)
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def eliminar_mesa(id_mesa):
        # Borrado lógico (Estado 9) para mantener historial
        query = "UPDATE dawa.mesas SET estado = 9, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_mesa))

    @staticmethod
    def restaurar_mesa(id_mesa):
        # Retorno al estado disponible (0)
        query = "UPDATE dawa.mesas SET estado = 0, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_mesa))