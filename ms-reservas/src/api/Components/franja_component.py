from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response


class FranjaComponent:

    @staticmethod
    def listar_franjas_por_local(idlocal):
        """
        Lista las franjas horarias disponibles para un local específico
        """
        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT id, idlocal, hora_inicio, hora_fin, estado
                  FROM dawa.franjas_horarias
                  WHERE idlocal = %s
                    AND estado = 0
                  ORDER BY hora_inicio \
                  """
            record = (idlocal,)
            result_query = DataBaseHandle.getRecords(sql, 0, record)

            if result_query['result']:
                data = result_query['data']
                result = True
            else:
                message = result_query['message']

        except Exception as ex:
            HandleLogs.write_error(ex)
            message = ex.__str__()
        finally:
            return internal_response(result, data, message)