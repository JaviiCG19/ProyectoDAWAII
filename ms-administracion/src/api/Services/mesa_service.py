from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime


class MesaService:
    @staticmethod
    def listar_por_local(id_local):
        query = """
                SELECT id, numero, maxper, estado
                FROM dawa.mesas
                WHERE idlocal = %s AND estado = 1
                ORDER BY CAST(NULLIF(SPLIT_PART(numero, '-', 2), '') AS INTEGER) ASC
                """
        return DataBaseHandle.getRecords(query, 0, (id_local,))

    @staticmethod
    def listar_por_mesas_inactiva(id_local):
        query = """
                SELECT id, numero, maxper, estado
                FROM dawa.mesas
                WHERE idlocal = %s AND estado = 0
                ORDER BY CAST(NULLIF(SPLIT_PART(numero, '-', 2), '') AS INTEGER) ASC
                """
        return DataBaseHandle.getRecords(query, 0, (id_local,))

    @staticmethod
    def obtener_por_id(id_mesa):
        query = "SELECT id, idlocal, numero, maxper, estado FROM dawa.mesas WHERE id = %s"
        return DataBaseHandle.getRecords(query, 1, (id_mesa,))

    @staticmethod
    def crear_mesa(data):
        # Limpieza de número
        raw_num = str(data.get('numero', '')).lower().replace("ms-", "").strip()
        if not raw_num:
            return {"result": False, "message": "El número de mesa no puede estar vacío"}

        identificador = f"ms-{raw_num}"

        # Validar si ya existe la mesa en ese local para evitar duplicados
        check_query = "SELECT id FROM dawa.mesas WHERE idlocal = %s AND numero = %s AND estado = 1"
        existe = DataBaseHandle.getRecords(check_query, 1, (data['idlocal'], identificador))
        if existe['result'] and existe['data']:
            return {"result": False, "message": f"La mesa {identificador} ya existe en este local"}

        query = """
                INSERT INTO dawa.mesas (idlocal, numero, maxper, estado, fecact)
                VALUES (%s, %s, %s, 1, %s)
                """
        record = (data['idlocal'], identificador, data.get('maxper', 2), datetime.now().date())
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def actualizar_mesa(id_mesa, data):
        # Verificar si la mesa existe
        mesa_actual = MesaService.obtener_por_id(id_mesa)
        if not mesa_actual['result'] or not mesa_actual['data']:
            return {"result": False, "message": "La mesa no existe"}

        raw_num = str(data.get('numero', '')).lower().replace("ms-", "").strip()
        identificador = f"ms-{raw_num}" if raw_num else mesa_actual['data'][0]['numero']

        query = """
                UPDATE dawa.mesas
                SET numero = %s, maxper = %s, fecact = %s
                WHERE id = %s
                """
        record = (identificador, data.get('maxper', 2), datetime.now().date(), id_mesa)
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def eliminar_mesa(id_mesa):
        query = "UPDATE dawa.mesas SET estado = 0, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now().date(), id_mesa))

    @staticmethod
    def restaurar_mesa(id_mesa):
        query = "UPDATE dawa.mesas SET estado = 1, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now().date(), id_mesa))