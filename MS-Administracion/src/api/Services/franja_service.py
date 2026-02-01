from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class FranjaService:
    @staticmethod
    def listar_por_local(id_local):
        # Usamos la tabla dawa.franjas que tiene diasem y tipres
        query = """
            SELECT id, idlocal, diasem, TRIM(horini) as horini, 
                   TRIM(horfin) as horfin, tipres, estado 
            FROM dawa.franjas 
            WHERE idlocal = %s AND estado = 1
            ORDER BY diasem ASC, horini ASC
        """
        return DataBaseHandle.getRecords(query, 0, (id_local,))

    @staticmethod
    def crear_franja(data):
        query = """
            INSERT INTO dawa.franjas (idlocal, diasem, horini, horfin, tipres, estado, fecact)
            VALUES (%s, %s, %s, %s, %s, 1, %s)
        """
        # Mantenemos las variables del Request: horini, horfin, diasem
        # Agregamos tipres (tipo de reserva) con valor por defecto 0 si no viene
        record = (
            data['idlocal'],
            data['diasem'],
            data['horini'],
            data['horfin'],
            data.get('tipres', 0),
            datetime.now().date()
        )
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def actualizar_franja(id_franja, data):
        query = """
            UPDATE dawa.franjas 
            SET diasem = %s, horini = %s, horfin = %s, tipres = %s, fecact = %s 
            WHERE id = %s AND estado = 1
        """
        record = (
            data['diasem'],
            data['horini'],
            data['horfin'],
            data.get('tipres', 0),
            datetime.now().date(),
            id_franja
        )
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def eliminar_franja(id_franja):
        # Borrado lógico: estado 0
        query = "UPDATE dawa.franjas SET estado = 0, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now().date(), id_franja))

    @staticmethod
    def restaurar_franja(id_franja):
        query = "UPDATE dawa.franjas SET estado = 1, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now().date(), id_franja))