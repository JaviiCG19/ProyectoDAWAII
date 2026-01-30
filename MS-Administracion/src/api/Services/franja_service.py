from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class FranjaService:
    @staticmethod
    def listar_por_local(id_local):
        query = "SELECT id, hora_inicio, hora_fin, estado FROM dawa.franjas_horarias WHERE idlocal = %s"
        return DataBaseHandle.getRecords(query, 0, (id_local,))

    @staticmethod
    def crear_franja(data):
        query = """
            INSERT INTO dawa.franjas_horarias (idlocal, hora_inicio, hora_fin, estado, fecact)
            VALUES (%s, %s, %s, %s, %s)
        """
        record = (
            data['idlocal'],
            data['hora_inicio'],
            data['hora_fin'],
            data.get('estado', 1),
            datetime.now()
        )
        return DataBaseHandle.ExecuteNonQuery(query, record)