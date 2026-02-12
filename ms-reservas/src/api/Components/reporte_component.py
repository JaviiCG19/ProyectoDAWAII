from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response


class ReporteComponent:

    @staticmethod
    def reservas_por_periodo(idlocal, fecha_inicio, fecha_fin):
        # 1. Inicializar message siempre al principio
        result = False
        data = None
        message = "Sin respuesta de la base de datos"  # Valor por defecto

        try:
            sql = """
                  SELECT COUNT(*)                                    as total_reservas, \
                         SUM(CASE WHEN estado = 0 THEN 1 ELSE 0 END) as pendientes, \
                         SUM(CASE WHEN estado = 1 THEN 1 ELSE 0 END) as canceladas, \
                         SUM(CASE WHEN estado = 2 THEN 1 ELSE 0 END) as confirmadas, \
                         SUM(CASE WHEN estado = 3 THEN 1 ELSE 0 END) as checkin, \
                         SUM(CASE WHEN estado = 4 THEN 1 ELSE 0 END) as noshow, \
                         SUM(numper)                                 as total_personas
                  FROM dawa.reservas
                  WHERE idlocal = %s \
                    AND fecha BETWEEN %s AND %s \
                  """
            record = (idlocal, fecha_inicio, fecha_fin)
            result_query = DataBaseHandle.getRecords(sql, 1, record)

            if result_query['result']:
                data = result_query['data']
                result = True
                message = None  # Si hay éxito, limpiamos el mensaje
            else:
                message = result_query.get('message', "Error al obtener registros")

        except Exception as ex:
            HandleLogs.write_error(ex)
            message = str(ex)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def top_clientes(idlocal, limite=10):

        result = False
        data = None
        message = None

        try:

            sql = """
                  SELECT c.id, 
                         c.nombre, 
                         c.ruc_cc, 
                         c.telefono, 
                         COUNT(r.id)                                   as total_reservas, 
                         SUM(r.numper)                                 as total_personas, 
                         SUM(CASE WHEN r.estado = 2 THEN 1 ELSE 0 END) as confirmadas, 
                         SUM(CASE WHEN r.estado = 3 THEN 1 ELSE 0 END) as checkin
                  FROM dawa.clientes c
                           INNER JOIN dawa.reservas r ON c.id = r.idcliente
                  WHERE r.idlocal = %s
                  GROUP BY c.id, c.nombre, c.ruc_cc, c.telefono
                  ORDER BY total_reservas DESC
                      LIMIT %s \
                  """

            record = (idlocal, limite)
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
    def uso_mesas(idlocal):

        result = False
        data = None
        message = None

        try:

            sql = """
                  SELECT m.id, \
                         m.numero, \
                         m.maxper, \
                         COUNT(r.id)                                   as total_reservas, \
                         SUM(CASE WHEN r.estado = 0 THEN 1 ELSE 0 END) as pendientes, \
                         SUM(CASE WHEN r.estado = 1 THEN 1 ELSE 0 END) as canceladas, \
                         SUM(CASE WHEN r.estado = 2 THEN 1 ELSE 0 END) as confirmadas, \
                         SUM(CASE WHEN r.estado = 3 THEN 1 ELSE 0 END) as checkin, \
                         SUM(CASE WHEN r.estado = 4 THEN 1 ELSE 0 END) as noshow, \
                         ROUND( \
                                 (SUM(CASE WHEN r.estado = 4 THEN 1 ELSE 0 END)::numeric / 
                            NULLIF(COUNT(r.id), 0) * 100), 2 \
                         )                                             as porcentaje_noshow, \
                         ROUND( \
                                 (SUM(CASE WHEN r.estado = 1 THEN 1 ELSE 0 END)::numeric / 
                            NULLIF(COUNT(r.id), 0) * 100), 2 \
                         )                                             as porcentaje_canceladas
                  FROM dawa.mesas m
                           LEFT JOIN dawa.reservas r ON m.id = r.idmesa
                  WHERE m.idlocal = %s
                  GROUP BY m.id, m.numero, m.maxper
                  ORDER BY total_reservas DESC \
                  """

            record = (idlocal,)
            result_query = DataBaseHandle.getRecords(sql, 0, record)

            if result_query['result']:
                data = result_query['data']
                result = True
            else:
                message = result_query.get('message', 'No se encontraron registros')

        except Exception as ex:
            HandleLogs.write_error(ex)
            message = str(ex)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def tasa_noshow_cancelaciones(idlocal, fecha_inicio, fecha_fin):

        result = False
        data = None
        message = None

        try:

            sql = """
                  SELECT COUNT(*) as total_reservas, \
                         ROUND( \
                                 (SUM(CASE WHEN estado = 4 THEN 1 ELSE 0 END)::numeric / 
                          NULLIF(COUNT(*), 0) * 100), 2 \
                         )        as porcentaje_noshow, \
                         ROUND( \
                                 (SUM(CASE WHEN estado = 1 THEN 1 ELSE 0 END)::numeric / 
                          NULLIF(COUNT(*), 0) * 100), 2 \
                         )        as porcentaje_canceladas
                  FROM dawa.reservas
                  WHERE idlocal = %s
                    AND fecha BETWEEN %s AND %s
                  """

            record = (idlocal, fecha_inicio, fecha_fin)
            result_query = DataBaseHandle.getRecords(sql, 1, record)

            if result_query['result']:
                data = result_query['data']
                result = True
            else:
                message = result_query.get('message', "No se pudo obtener el reporte")

        except Exception as ex:
            HandleLogs.write_error(ex)
            message = str(ex)
        finally:
            # Ahora el finally siempre tendrá acceso a result, data y message
            return internal_response(result, data, message)

    @staticmethod
    def reservas_por_franja(idlocal):

        result = False
        data = None
        message = None

        try:

            # Aquí filtramos la reserva por idlocal dentro del conteo
            sql = """
                  SELECT f.id          as franja_id, \
                         f.hora_inicio, \
                         f.hora_fin,
                         COUNT(r.id)   as total_reservas,
                         SUM(r.numper) as total_personas
                  FROM dawa.franjas_horarias f
                           LEFT JOIN dawa.reservas r ON f.id = r.franja_id AND r.idlocal = %s
                  GROUP BY f.id, f.hora_inicio, f.hora_fin
                  ORDER BY f.hora_inicio ASC \
                  """
            result_query = DataBaseHandle.getRecords(sql, 0, (idlocal,))

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
