from datetime import date
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response


class ReservaComponent:

    @staticmethod
    def crear_reserva(idlocal, idmesa, idcliente, fecha, franja_id, numper):
        try:
            result = False
            data = None
            message = None

            sql_check = """
                        SELECT COUNT(*) as total
                        FROM dawa.reservas
                        WHERE idmesa = %s
                          AND fecha = %s
                          AND franja_id = %s
                          AND estado = 0
                        """
            check_record = (idmesa, fecha, franja_id)
            result_check = DataBaseHandle.getRecords(sql_check, 1, check_record)

            if result_check['result'] and result_check['data']['total'] > 0:
                message = "La mesa ya está reservada para esa franja horaria"
                return internal_response(False, None, message)

            sql = """
                  INSERT INTO dawa.reservas
                      (idlocal, idmesa, idcliente, fecha, franja_id, numper, estado, fecact)
                  VALUES (%s, %s, %s, %s, %s, %s, 0, %s)
                  """
            record = (idlocal, idmesa, idcliente, fecha, franja_id, numper, date.today())
            result_insert = DataBaseHandle.ExecuteNonQuery(sql, record)

            if result_insert['result']:
                result = True
                data = result_insert['data']
            else:
                message = result_insert['message']

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al crear reserva -> " + err.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def listar_reservas_activas():
        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT id,
                         idlocal,
                         idmesa,
                         idcliente,
                         fecha,
                         franja_id,
                         numper,
                         estado,
                         fecact
                  FROM dawa.reservas
                  WHERE estado = 0
                  ORDER BY fecha, franja_id
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
    def listar_todas_reservas(idlocal):
        result = False
        data = None
        message = None

        try:
            sql = """
                  SELECT id,
                         idlocal,
                         idmesa,
                         idcliente,
                         fecha,
                         franja_id,
                         numper,
                         estado,
                         fecact
                  FROM dawa.reservas
                  WHERE idlocal = %s
                  ORDER BY fecha DESC, franja_id ASC \
                  """
            record = (idlocal,)
            result_query = DataBaseHandle.getRecords(sql, 0, record)

            if result_query['result']:
                data = result_query['data']
                result = True
            else:
                message = result_query.get('message', "No se encontraron reservas")

        except Exception as ex:
            HandleLogs.write_error(ex)
            message = str(ex)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def obtener_reserva(reserva_id):
        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT id,
                         idlocal,
                         idmesa,
                         idcliente,
                         fecha,
                         franja_id,
                         numper,
                         estado,
                         fecact
                  FROM dawa.reservas
                  WHERE id = %s
                  """
            record = (reserva_id,)
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
    def confirmar_reserva(idreserva):
        try:
            result = False
            data = None
            message = None

            sql_check = """
                        SELECT id
                        FROM dawa.reservas
                        WHERE id = %s
                          AND estado = 0
                        """
            check_result = DataBaseHandle.getRecords(sql_check, 1, (idreserva,))

            if not check_result['result'] or not check_result['data']:
                message = "Reserva no encontrada o no está pendiente"
                return internal_response(False, None, message)

            sql_anticipo = """
                           SELECT id
                           FROM dawa.anticipos
                           WHERE idreserva = %s
                             AND estado = 0
                           """
            anticipo_result = DataBaseHandle.getRecords(sql_anticipo, 1, (idreserva,))

            if not anticipo_result['result'] or not anticipo_result['data']:
                message = "La reserva no tiene anticipo registrado"
                return internal_response(False, None, message)

            #1 = confirmada
            sql = """
                  UPDATE dawa.reservas
                  SET estado = 1,
                      fecact = %s
                  WHERE id = %s
                  """
            record = (date.today(), idreserva)
            result_update = DataBaseHandle.ExecuteNonQuery(sql, record)

            if result_update['result']:
                result = True
                data = idreserva
            else:
                message = result_update['message']

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al confirmar reserva -> " + err.__str__()
        finally:
            return internal_response(result, data, message)
    #2=cancelada
    @staticmethod
    def cancelar_reserva(idreserva):
        try:
            result = False
            data = None
            message = None

            sql = """
                  UPDATE dawa.reservas
                  SET estado = 2,
                      fecact = %s
                  WHERE id = %s
                    AND estado = 0
                  """
            record = (date.today(), idreserva)
            result_update = DataBaseHandle.ExecuteNonQuery(sql, record)

            if result_update['result'] and result_update['data'] > 0:
                result = True
                data = idreserva
            else:
                message = "Reserva no encontrada o ya cancelada"

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al cancelar reserva -> " + err.__str__()
        finally:
            return internal_response(result, data, message)
    #3=checkin
    @staticmethod
    def checkin_reserva(reserva_id):
        try:
            result = False
            data = None
            message = None

            sql = """
                  UPDATE dawa.reservas
                  SET estado = 3,
                      fecact = %s
                  WHERE id = %s
                    AND estado = 1 \
                  """
            record = (date.today(), reserva_id)
            result_update = DataBaseHandle.ExecuteNonQuery(sql, record)

            # Si la reserva se actualizó correctamente (existía y estaba confirmada)
            if result_update['result'] and result_update['data'] > 0:

                sql_mesa = """
                           UPDATE dawa.mesas
                           SET estado = 0
                           WHERE id = (SELECT idmesa FROM dawa.reservas WHERE id = %s)
                           """
                DataBaseHandle.ExecuteNonQuery(sql_mesa, (reserva_id,))

                result = True
                data = reserva_id
            else:
                message = "Reserva no confirmada o no encontrada"

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al hacer check-in -> " + err.__str__()
        finally:
            return internal_response(result, data, message)

    #4=noshow
    @staticmethod
    def marcar_no_show(reserva_id):
        try:
            result = False
            data = None
            message = None

            sql = """
                  UPDATE dawa.reservas
                  SET estado = 4,
                      fecact = %s
                  WHERE id = %s
                    AND estado IN (0, 1)      -- antes (0,2), ahora 0 y 1
                  """
            record = (date.today(), reserva_id)
            result_update = DataBaseHandle.ExecuteNonQuery(sql, record)

            if result_update['result'] and result_update['data'] > 0:
                result = True
                data = reserva_id
            else:
                message = "Reserva no válida para no-show"

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al marcar no-show -> " + err.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def eliminar_reserva(reserva_id):
        try:
            result = False
            data = None
            message = None

            sql = """
                  DELETE
                  FROM dawa.reservas
                  WHERE id = %s
                  """
            record = (reserva_id,)
            result_delete = DataBaseHandle.ExecuteNonQuery(sql, record)

            if result_delete['result']:
                result = True
                data = reserva_id
            else:
                message = result_delete['message']

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al eliminar reserva -> " + err.__str__()
        finally:
            return internal_response(result, data, message)