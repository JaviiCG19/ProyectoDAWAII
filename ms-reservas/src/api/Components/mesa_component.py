from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response


class MesaComponent:

    @staticmethod
    def mesas_disponibles_por_fecha(fecha):

        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT m.id, m.numero, m.maxper
                  FROM dawa.mesas m
                  WHERE m.id NOT IN (SELECT idmesa \
                                     FROM dawa.reservas \
                                     WHERE fecha = %s \
                                       AND estado = 0)
                  ORDER BY m.numero \
                  """
            record = (fecha,)
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
