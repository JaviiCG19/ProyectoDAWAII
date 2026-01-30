from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response


class ReporteComponent:

    @staticmethod
    def reservas_por_periodo(fecha_inicio, fecha_fin):

        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT
                      COUNT(*) as total_reservas,
                      SUM(CASE WHEN estado = 0 THEN 1 ELSE 0 END) as pendientes,
                      SUM(CASE WHEN estado = 1 THEN 1 ELSE 0 END) as canceladas,
                      SUM(CASE WHEN estado = 2 THEN 1 ELSE 0 END) as confirmadas,
                      SUM(CASE WHEN estado = 3 THEN 1 ELSE 0 END) as checkin,
                      SUM(CASE WHEN estado = 4 THEN 1 ELSE 0 END) as noshow,
                      SUM(numper) as total_personas
                  FROM dawa.reservas
                  WHERE fecha BETWEEN %s AND %s \
                  """
            record = (fecha_inicio, fecha_fin)
            result_query = DataBaseHandle.getRecords(sql, 1, record)

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
    def top_clientes(limite=10):

        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT
                      c.id,
                      c.nombre,
                      c.ruc_cc,
                      c.telefono,
                      COUNT(r.id) as total_reservas,
                      SUM(r.numper) as total_personas,
                      SUM(CASE WHEN r.estado = 2 THEN 1 ELSE 0 END) as confirmadas,
                      SUM(CASE WHEN r.estado = 3 THEN 1 ELSE 0 END) as checkin
                  FROM dawa.clientes c
                           LEFT JOIN dawa.reservas r ON c.id = r.idcliente
                  GROUP BY c.id, c.nombre, c.ruc_cc, c.telefono
                  HAVING COUNT(r.id) > 0
                  ORDER BY total_reservas DESC
                      LIMIT %s \
                  """
            record = (limite,)
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
    def uso_mesas():

        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT
                      m.id,
                      m.numero,
                      m.maxper,
                      COUNT(r.id) as total_reservas,
                      SUM(CASE WHEN r.estado = 0 THEN 1 ELSE 0 END) as pendientes,
                      SUM(CASE WHEN r.estado = 1 THEN 1 ELSE 0 END) as canceladas,
                      SUM(CASE WHEN r.estado = 2 THEN 1 ELSE 0 END) as confirmadas,
                      SUM(CASE WHEN r.estado = 3 THEN 1 ELSE 0 END) as checkin,
                      SUM(CASE WHEN r.estado = 4 THEN 1 ELSE 0 END) as noshow,
                      ROUND(
                              (SUM(CASE WHEN r.estado = 4 THEN 1 ELSE 0 END)::numeric / 
                        NULLIF(COUNT(r.id), 0) * 100), 2
                      ) as porcentaje_noshow,
                      ROUND(
                              (SUM(CASE WHEN r.estado = 1 THEN 1 ELSE 0 END)::numeric / 
                        NULLIF(COUNT(r.id), 0) * 100), 2
                      ) as porcentaje_canceladas
                  FROM dawa.mesas m
                           LEFT JOIN dawa.reservas r ON m.id = r.idmesa
                  GROUP BY m.id, m.numero, m.maxper
                  ORDER BY total_reservas DESC \
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

    @staticmethod
    def tasa_noshow_cancelaciones(fecha_inicio, fecha_fin):

        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT
                      COUNT(*) as total_reservas,
                      SUM(CASE WHEN estado = 4 THEN 1 ELSE 0 END) as noshow,
                      SUM(CASE WHEN estado = 1 THEN 1 ELSE 0 END) as canceladas,
                      ROUND(
                              (SUM(CASE WHEN estado = 4 THEN 1 ELSE 0 END)::numeric / 
                        NULLIF(COUNT(*), 0) * 100), 2
                      ) as porcentaje_noshow,
                      ROUND(
                              (SUM(CASE WHEN estado = 1 THEN 1 ELSE 0 END)::numeric / 
                        NULLIF(COUNT(*), 0) * 100), 2
                      ) as porcentaje_canceladas,
                      ROUND(
                              ((SUM(CASE WHEN estado = 4 THEN 1 ELSE 0 END) +
                                SUM(CASE WHEN estado = 1 THEN 1 ELSE 0 END))::numeric /
                                  NULLIF(COUNT(*), 0) * 100), 2
                    ) as porcentaje_perdidas
                  FROM dawa.reservas
                  WHERE fecha BETWEEN %s AND %s \
                  """
            record = (fecha_inicio, fecha_fin)
            result_query = DataBaseHandle.getRecords(sql, 1, record)

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
    def reservas_por_franja():

        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT f.id                                          as franja_id, \
                         f.hora_inicio, \
                         f.hora_fin, \
                         COUNT(r.id)                                   as total_reservas, \
                         SUM(r.numper)                                 as total_personas, \
                         SUM(CASE WHEN r.estado = 2 THEN 1 ELSE 0 END) as confirmadas, \
                         SUM(CASE WHEN r.estado = 3 THEN 1 ELSE 0 END) as checkin, \
                         ROUND(AVG(r.numper), 2)                       as promedio_personas
                  FROM dawa.franjas_horarias f
                           LEFT JOIN dawa.reservas r ON f.id = r.franja_id
                  GROUP BY f.id, f.hora_inicio, f.hora_fin
                  ORDER BY total_reservas DESC \
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
