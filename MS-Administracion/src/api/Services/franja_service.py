from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class FranjaService:
    @staticmethod
    def listar_por_local(id_local):
        """
        CORRECCIÓN: Aislamiento por sucursal.
        Filtramos por estado = 1.
        """
        # Según tu SQL, la tabla es franjas_horarias
        query = "SELECT id, idlocal, hora_inicio, hora_fin, estado FROM dawa.franjas_horarias WHERE idlocal = %s AND estado = 1"
        return DataBaseHandle.getRecords(query, (id_local,))

    @staticmethod
    def obtener_por_id(id_franja):
        """Busca una franja horaria específica por su clave primaria."""
        query = "SELECT id, idlocal, hora_inicio, hora_fin, estado FROM dawa.franjas_horarias WHERE id = %s"
        return DataBaseHandle.getRecord(query, (id_franja,))

    @staticmethod
    def crear_franja(data):
        """
        Viculamos la franja al idlocal.

        """
        query = """
            INSERT INTO dawa.franjas_horarias (idlocal, hora_inicio, hora_fin, estado, fecact)
            VALUES (%s, %s, %s, 1, %s)
        """
        # Usamos .date() para que sea compatible con el tipo DATE de tu SQL
        record = (data['idlocal'], data['hora_inicio'], data['hora_fin'], datetime.now().date())
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def actualizar_franja(id_franja, data):
        """Actualiza el rango de tiempo y refresca el fecact ."""
        query = """
            UPDATE dawa.franjas_horarias 
            SET hora_inicio = %s, hora_fin = %s, fecact = %s 
            WHERE id = %s
        """
        record = (data['hora_inicio'], data['hora_fin'], datetime.now().date(), id_franja)
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def eliminar_franja(id_franja):
        """
        BORRADO LÓGICO: Estado a 0 y actualizamos fecact para saber cuándo se desactivó.
        """
        query = "UPDATE dawa.franjas_horarias SET estado = 0, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now().date(), id_franja))

    @staticmethod
    def restaurar_franja(id_franja):
        """Revierte el borrado lógico devolviendo el estado a 1."""
        query = "UPDATE dawa.franjas_horarias SET estado = 1, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now().date(), id_franja))