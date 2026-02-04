from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class MesaComponent:

    @staticmethod
    def mesas_disponibles_por_fecha(fecha, franja_id=None, idlocal=None):
        """
        Obtiene mesas disponibles para una fecha específica
        Si se proporciona franja_id, filtra también por franja horaria
        Si se proporciona idlocal, filtra por local
        """
        try:
            result = False
            data = None
            message = None

            if franja_id and idlocal:
                # Filtrar por fecha, franja horaria Y local
                sql = """
                      SELECT m.id, m.numero, m.maxper, m.idlocal
                      FROM dawa.mesas m
                      WHERE m.idlocal = %s
                        AND m.id NOT IN (SELECT idmesa \
                                         FROM dawa.reservas \
                                         WHERE fecha = %s \
                                           AND franja_id = %s \
                                           AND estado IN (0, 2))
                        AND m.estado = 0
                      ORDER BY m.numero \
                      """
                record = (idlocal, fecha, franja_id)
            elif idlocal:
                # Filtrar por fecha Y local
                sql = """
                      SELECT m.id, m.numero, m.maxper, m.idlocal
                      FROM dawa.mesas m
                      WHERE m.idlocal = %s
                        AND m.id NOT IN (SELECT DISTINCT idmesa \
                                         FROM dawa.reservas \
                                         WHERE fecha = %s \
                                           AND estado IN (0, 2))
                        AND m.estado = 0
                      ORDER BY m.numero \
                      """
                record = (idlocal, fecha)
            elif franja_id:
                # Filtrar por fecha Y franja horaria (sin local específico)
                sql = """
                      SELECT m.id, m.numero, m.maxper, m.idlocal
                      FROM dawa.mesas m
                      WHERE m.id NOT IN (SELECT idmesa \
                                         FROM dawa.reservas \
                                         WHERE fecha = %s \
                                           AND franja_id = %s \
                                           AND estado IN (0, 2))
                        AND m.estado = 0
                      ORDER BY m.numero \
                      """
                record = (fecha, franja_id)
            else:
                # Filtrar solo por fecha
                sql = """
                      SELECT m.id, m.numero, m.maxper, m.idlocal
                      FROM dawa.mesas m
                      WHERE m.id NOT IN (SELECT DISTINCT idmesa \
                                         FROM dawa.reservas \
                                         WHERE fecha = %s \
                                           AND estado IN (0, 2))
                        AND m.estado = 0
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

    @staticmethod
    def listar_todas_mesas():

        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT m.id, m.numero, m.maxper, m.idlocal, m.estado
                  FROM dawa.mesas m
                  WHERE m.estado = 0
                  ORDER BY m.numero \
                  """
            result_query = DataBaseHandle.getRecords(sql, 0)

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