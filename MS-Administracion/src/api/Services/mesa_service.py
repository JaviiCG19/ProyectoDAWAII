from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime


class MesaService:
    @staticmethod
    def listar_por_local(id_local):
        """
        Lista las mesas del local.
        """
        query = """
                SELECT id, numero, maxper, estado
                FROM dawa.mesas
                WHERE idlocal = %s \
                  AND estado = 1
                ORDER BY CAST(SPLIT_PART(numero, '-', 2) AS INTEGER) ASC \
                """
        return DataBaseHandle.getRecords(query, (id_local,))

    @staticmethod
    def obtener_por_id(id_mesa):
        query = "SELECT id, idlocal, numero, maxper, estado FROM dawa.mesas WHERE id = %s"
        return DataBaseHandle.getRecords(query, 1, (id_mesa,))

    @staticmethod
    def crear_mesa(data):

        query = """
                INSERT INTO dawa.mesas (idlocal, numero, maxper, estado, fecact)
                VALUES (%s, %s, %s, 1, %s) \
                """
        num = str(data['numero'])
        identificador = num if "ms-" in num else f"ms-{num}"

        record = (data['idlocal'], identificador, data.get('maxper', 4), datetime.now())
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def actualizar_mesa(id_mesa, data):
        """
        Actualiza numero y capacidad.
        """
        query = """
                UPDATE dawa.mesas
                SET numero = %s, \
                    maxper = %s, \
                    fecact = %s
                WHERE id = %s \
                """
        # Aseguramos el formato ms-X en la edición también
        num = str(data['numero'])
        identificador = num if "ms-" in num else f"ms-{num}"

        record = (identificador, data.get('maxper', 4), datetime.now(), id_mesa)
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def eliminar_mesa(id_mesa):
        """
        BORRADO LÓGICO: Estado 0.
        """
        query = "UPDATE dawa.mesas SET estado = 0, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_mesa))

    @staticmethod
    def restaurar_mesa(id_mesa):
        """Restaura la mesa a Estado 1."""
        query = "UPDATE dawa.mesas SET estado = 1, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_mesa))