from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class MesaService:
    @staticmethod
    def listar_por_local(id_local):
        """
        CORRECCIÓN
        Filtra las mesas para que el Admin de Local solo vea su inventario.
        Estado != 9 asegura que no veamos lo borrado lógicamente.
        """
        query = "SELECT id, numero, maxper, estado FROM dawa.mesas WHERE idlocal = %s AND estado != 9 ORDER BY numero"
        return DataBaseHandle.getRecords(query, 0, (id_local,))

    @staticmethod
    def obtener_por_id(id_mesa):
        """Busca una mesa específica para edición."""
        query = "SELECT id, idlocal, numero, maxper, estado FROM dawa.mesas WHERE id = %s"
        return DataBaseHandle.getRecords(query, 1, (id_mesa,))

    @staticmethod
    def crear_mesa(data):
        """
        Cada mesa se crea con su número y capacidad máxima.
        """
        query = """
            INSERT INTO dawa.mesas (idlocal, numero, maxper, estado, fecact)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        """
        # Estado 0 = Disponible / Operativa
        record = (data['idlocal'], data['numero'], data.get('maxper', 2), 0, datetime.now())
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def actualizar_mesa(id_mesa, data):
        """Modifica datos de la mesa sin afectar su vinculación al local."""
        query = """
            UPDATE dawa.mesas 
            SET numero = %s, maxper = %s, fecact = %s 
            WHERE id = %s
        """
        record = (data['numero'], data.get('maxper', 2), datetime.now(), id_mesa)
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def eliminar_mesa(id_mesa):
        """
        BORRADO LÓGICO (Estado 9).
        Evita romper la integridad referencial si la mesa tuvo reservas previas.
        """
        query = "UPDATE dawa.mesas SET estado = 9, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_mesa))