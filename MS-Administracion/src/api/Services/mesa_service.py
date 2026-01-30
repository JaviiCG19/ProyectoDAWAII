from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class MesaService:
    @staticmethod
    def listar_por_local(id_local):
        # Filtra mesas de un local específico
        query = "SELECT id, numero, maxper, estado FROM dawa.mesas WHERE idlocal = %s"
        return DataBaseHandle.getRecords(query, 0, (id_local,))

    @staticmethod
    def crear_mesa(data):
        query = """
            INSERT INTO dawa.mesas (idlocal, numero, maxper, estado, fecact)
            VALUES (%s, %s, %s, %s, %s)
        """
        record = (
            data['idlocal'],
            data['numero'],
            data.get('maxper', 2),
            0, # Estado 0 = Disponible
            datetime.now()
        )
        return DataBaseHandle.ExecuteNonQuery(query, record)