from datetime import date
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response


class ReservaComponent:

    @staticmethod
    def crear_reserva(idlocal, idmesa, idcliente, fecha, franja_id, numper):
        """
        Crea una nueva reserva
        """
        try:
            result = False
            data = None
            message = None

            # Verificar si ya existe reserva
            sql_check = """
                        SELECT COUNT(*) as total
                        FROM dawa.reservas
                        WHERE idmesa = %s
                          AND fecha = %s
                          AND franja_id = %s
                          AND estado = 0 \
                        """
            check_record = (idmesa, fecha, franja_id)
            result_check = DataBaseHandle.getRecords(sql_check, 1, check_record)

            if result_check['result'] and result_check['data']['total'] > 0:
                message = "La mesa ya está reservada para esa franja horaria"
                return internal_response(False, None, message)

            sql = """
                  INSERT INTO dawa.reservas
                      (idlocal, idmesa, idcliente, fecha, franja_id, numper, estado, fecact)
                  VALUES (%s, %s, %s, %s, %s, %s, 0, %s) \
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
        """
        Lista todas las reservas activas (estado = 0)
        """
        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT id, \
                         idlocal, \
                         idmesa, \
                         idcliente, \
                         fecha,
                         franja_id, \
                         numper, \
                         estado, \
                         fecact
                  FROM dawa.reservas
                  WHERE estado = 0
                  ORDER BY fecha, franja_id \
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
    def obtener_reserva(reserva_id):
        """
        Obtiene una reserva por ID
        """
        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT id, \
                         idlocal, \
                         idmesa, \
                         idcliente, \
                         fecha,
                         franja_id, \
                         numper, \
                         estado, \
                         fecact
                  FROM dawa.reservas
                  WHERE id = %s \
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
        """
        Confirma una reserva (cambia estado a 2)
        """
        try:
            result = False
            data = None
            message = None

            # Verificar que existe y está pendiente
            sql_check = """
                        SELECT id \
                        FROM dawa.reservas
                        WHERE id = %s \
                          AND estado = 0 \
                        """
            check_result = DataBaseHandle.getRecords(sql_check, 1, (idreserva,))

            if not check_result['result'] or not check_result['data']:
                message = "Reserva no encontrada o no está pendiente"
                return internal_response(False, None, message)

            # Verificar anticipo
            sql_anticipo = """
                           SELECT id \
                           FROM dawa.anticipos
                           WHERE idreserva = %s \
                             AND estado = 0 \
                           """
            anticipo_result = DataBaseHandle.getRecords(sql_anticipo, 1, (idreserva,))

            if not anticipo_result['result'] or not anticipo_result['data']:
                message = "La reserva no tiene anticipo registrado"
                return internal_response(False, None, message)

            # Actualizar estado
            sql = """
                  UPDATE dawa.reservas
                  SET estado = 2, \
                      fecact = %s
                  WHERE id = %s \
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

    @staticmethod
    def cancelar_reserva(idreserva):
        """
        Cancela una reserva (cambia estado a 1)
        """
        try:
            result = False
            data = None
            message = None

            sql = """
                  UPDATE dawa.reservas
                  SET estado = 1, \
                      fecact = %s
                  WHERE id = %s \
                    AND estado = 0 \
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

    @staticmethod
    def checkin_reserva(reserva_id):
        """
        Realiza check-in de una reserva (cambia estado a 3)
        """
        try:
            result = False
            data = None
            message = None

            sql = """
                  UPDATE dawa.reservas
                  SET estado = 3, \
                      fecact = %s
                  WHERE id = %s \
                    AND estado = 2 \
                  """
            record = (date.today(), reserva_id)
            result_update = DataBaseHandle.ExecuteNonQuery(sql, record)

            if result_update['result'] and result_update['data'] > 0:
                result = True
                data = reserva_id
            else:
                message = "Reserva no confirmada o no encontrada"

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al hacer check-in -> " + err.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def marcar_no_show(reserva_id):
        """
        Marca una reserva como no-show (cambia estado a 4)
        """
        try:
            result = False
            data = None
            message = None

            sql = """
                  UPDATE dawa.reservas
                  SET estado = 4, \
                      fecact = %s
                  WHERE id = %s \
                    AND estado IN (0, 2) \
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
        """
        Elimina una reserva
        """
        try:
            result = False
            data = None
            message = None

            sql = """
                  DELETE \
                  FROM dawa.reservas
                  WHERE id = %s \
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