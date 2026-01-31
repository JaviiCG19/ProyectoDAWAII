from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime


class EmpresaService:
    @staticmethod
    def crear_empresa(data):

        query = """
                INSERT INTO dawa.empresas (nomleg, nomfan, ruc, fecact, estado)
                VALUES (%s, %s, %s, %s, 1) RETURNING id \
                """
        record = (data['nomleg'], data['nomfan'], data['ruc'], datetime.now())


        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def listar_empresas():
        # Agregamos 'result' al query para que el componente sepa si fue exitoso
        query = "SELECT id, nomleg, nomfan, ruc FROM dawa.empresas WHERE estado = 1"
        return DataBaseHandle.getRecords(query, 0)