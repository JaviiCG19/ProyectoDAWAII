
from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class LocalService:
    @staticmethod
    def listar_locales():
        # Trae todos los locales (necesario para Alexander en Reservas)
        query = "SELECT id, idcia, detalle, direccion, totmesas FROM dawa.locales"
        return DataBaseHandle.getRecords(query, 0)

    @staticmethod
    def crear_local(data):
        # Inserta un nuevo local
        query = """
            INSERT INTO dawa.locales (idcia, detalle, direccion, totmesas, fecact)
            VALUES (%s, %s, %s, %s, %s)
        """
        record = (
            data['idcia'],
            data['detalle'],
            data['direccion'],
            data.get('totmesas', 1),
            datetime.now()
        )
        return DataBaseHandle.ExecuteNonQuery(query, record)