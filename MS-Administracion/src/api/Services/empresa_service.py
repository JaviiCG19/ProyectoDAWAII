from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class EmpresaService:
    @staticmethod
    def crear_empresa(data):
        """
        CORRECCIÓN: Se usa el estado para la lógica y fecact para el registro.
        """
        query = """
                INSERT INTO dawa.empresas (nomleg, nomfan, ruc, fecact, estado)
                VALUES (%s, %s, %s, CURRENT_DATE, 1)
                """
        # Ya no necesitamos pasar datetime desde Python si usamos CURRENT_DATE en el SQL
        record = (data['nomleg'], data['nomfan'], data['ruc'])
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def listar_empresas():

        query = "SELECT id, nomleg, nomfan, ruc, fecact FROM dawa.empresas WHERE estado = 1"
        return DataBaseHandle.getRecords(query, 0)

    @staticmethod
    def actualizar_empresa(id_cia, data):

        query = """
                UPDATE dawa.empresas
                SET nomleg = %s, nomfan = %s, ruc = %s, fecact = CURRENT_DATE
                WHERE id = %s
                """
        record = (data['nomleg'], data['nomfan'], data['ruc'], id_cia)
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def eliminar_empresa(id_cia):
        """
        BORRADO LÓGICO: Actualiza estado a 0 y registra la fecha de la baja en fecact.
        """
        try:
            # 1. Desactivar la empresa principal
            query_emp = "UPDATE dawa.empresas SET estado = 0, fecact = CURRENT_DATE WHERE id = %s"
            DataBaseHandle.ExecuteNonQuery(query_emp, (id_cia,))

            # 2. Desactivar todos los locales vinculados (Aislamiento de datos)
            query_loc = "UPDATE dawa.locales SET estado = 0, fecact = CURRENT_DATE WHERE idcia = %s"
            return DataBaseHandle.ExecuteNonQuery(query_loc, (id_cia,))
        except Exception as e:
            return {"result": False, "message": str(e)}