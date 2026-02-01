from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class EmpresaService:
    @staticmethod
    def crear_empresa(data):
        query = """
                INSERT INTO dawa.empresas (nomleg, nomfan, ruc, fecact, estado)
                VALUES (%s, %s, %s, %s, 1) RETURNING id
                """

        record = (data['nomleg'], data['nomfan'], data['ruc'], datetime.now().date())
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def listar_empresas():
        query = "SELECT id, nomleg, nomfan, ruc FROM dawa.empresas WHERE estado = 1 ORDER BY id DESC"
        # Agregamos el 0 para indicar que devuelva todos los registros
        return DataBaseHandle.getRecords(query, 0)

    @staticmethod
    def listar_eliminados():

        query = "SELECT id, nomleg, nomfan, ruc FROM dawa.empresas WHERE estado = 0 ORDER BY id DESC"
        return DataBaseHandle.getRecords(query, 0)

    @staticmethod
    def obtener_por_id(id_cia):
        query = "SELECT id, nomleg, nomfan, ruc FROM dawa.empresas WHERE id = %s"
        return DataBaseHandle.getRecords(query, 1, (id_cia,))

    @staticmethod
    def actualizar_empresa(id_cia, data):
        query = """
                UPDATE dawa.empresas 
                SET nomleg = %s, nomfan = %s, ruc = %s, fecact = %s 
                WHERE id = %s AND estado = 1
                """
        record = (data['nomleg'], data['nomfan'], data['ruc'], datetime.now().date(), id_cia)
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def eliminar_empresa(id_cia):
        # Borrado lógico: Estado 0
        query = "UPDATE dawa.empresas SET estado = 0, fecact = %s WHERE id = %s AND estado = 1"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now().date(), id_cia))

    @staticmethod
    def restaurar_empresa(id_cia):
        # Restauración: Estado 1
        query = "UPDATE dawa.empresas SET estado = 1, fecact = %s WHERE id = %s AND estado = 0"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now().date(), id_cia))