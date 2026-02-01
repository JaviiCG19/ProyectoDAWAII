from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime


class EmpresaService:
    @staticmethod
    def crear_empresa(data):
        """
        CORRECCIÓN
        Creamos la empresa con estado activo (1) y capturamos su ID
        para que el Gerente pueda empezar a crear sus sucursales.
        """
        query = """
                INSERT INTO dawa.empresas (nomleg, nomfan, ruc, fecact, estado)
                VALUES (%s, %s, %s, %s, 1)
                """
        # Los datos vienen validados desde el EmpresaRequest (RUC 13 dígitos, etc.)
        record = (data['nomleg'], data['nomfan'], data['ruc'], datetime.now())

        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def listar_empresas():
        """
        Este metodo es el que permite al sistema identificar que empresas
        existen para luego filtrar sus sucursales por 'idcia'.
        """
        query = "SELECT id, nomleg, nomfan, ruc FROM dawa.empresas WHERE estado = 1"
        return DataBaseHandle.getRecords(query, 0)