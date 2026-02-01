from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class FranjaService:
    @staticmethod
    def listar_por_local(id_local):
        """
        CORRECCIÓN: Aislamiento por sucursal.
        Filtramos por idlocal para que el Admin de Sucursal solo gestione sus horarios.
        Solo mostramos estado = 1 (Activas).
        """
        query = "SELECT id, idlocal, hora_inicio, hora_fin, estado FROM dawa.franjas_horarias WHERE idlocal = %s AND estado = 1"
        return DataBaseHandle.getRecords(query, 0, (id_local,))

    @staticmethod
    def obtener_por_id(id_franja):
        """Busca una franja horaria específica por su clave primaria."""
        query = "SELECT id, idlocal, hora_inicio, hora_fin, estado FROM dawa.franjas_horarias WHERE id = %s"
        return DataBaseHandle.getRecords(query, 1, (id_franja,))

    @staticmethod
    def crear_franja(data):
        """
       Aquí vinculamos físicamente la franja al idlocal.
        El estado inicia en 1 (Activo).
        """
        query = """
            INSERT INTO dawa.franjas_horarias (idlocal, hora_inicio, hora_fin, estado, fecact)
            VALUES (%s, %s, %s, %s, %s)
        """
        record = (data['idlocal'], data['hora_inicio'], data['hora_fin'], 1, datetime.now())
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def actualizar_franja(id_franja, data):
        """Actualiza el rango de tiempo de una reserva específica."""
        query = """
            UPDATE dawa.franjas_horarias 
            SET hora_inicio = %s, hora_fin = %s, fecact = %s 
            WHERE id = %s
        """
        record = (data['hora_inicio'], data['hora_fin'], datetime.now(), id_franja)
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def eliminar_franja(id_franja):
        """
        BORRADO LÓGICO:  Cambiamos estado a 0. No eliminamos el registro por si hay reservas .
        """
        query = "UPDATE dawa.franjas_horarias SET estado = 0, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_franja))

    @staticmethod
    def restaurar_franja(id_franja):
        """Revierte el borrado lógico devolviendo el estado a 1."""
        query = "UPDATE dawa.franjas_horarias SET estado = 1, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_franja))