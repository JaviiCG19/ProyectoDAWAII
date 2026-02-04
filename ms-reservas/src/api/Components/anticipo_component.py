from datetime import date
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class AnticipoComponent:

    @staticmethod
    def crear_anticipo(idreserva, monto):

        try:
            result = False
            data = None
            message = None

            sql_check = """
                        SELECT id \
                        FROM dawa.reservas
                        WHERE id = %s \
                          AND estado = 0 \
                        """
            check_result = DataBaseHandle.getRecords(sql_check, 1, (idreserva,))

            if not check_result['result'] or not check_result['data']:
                message = "Reserva no encontrada o no activa"
                return internal_response(False, None, message)

            sql = """
                  INSERT INTO dawa.anticipos
                      (idreserva, monto, fecha, estado, fecact)
                  VALUES (%s, %s, %s, 0, %s) \
                  """
            record = (idreserva, monto, date.today(), date.today())
            result_insert = DataBaseHandle.ExecuteNonQuery(sql, record)

            if result_insert['result']:
                result = True
                data = result_insert['data']
            else:
                message = result_insert['message']

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al crear anticipo -> " + err.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def obtener_anticipo_por_reserva(idreserva):

        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT id, idreserva, monto, fecha, estado
                  FROM dawa.anticipos
                  WHERE idreserva = %s \
                    AND estado = 0 \
                  """
            record = (idreserva,)
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