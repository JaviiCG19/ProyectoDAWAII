from datetime import date
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response


class ClienteComponent:

    @staticmethod
    def crear_cliente(nombre, ruc_cc, telefono):

        try:
            result = False
            data = None
            message = None

            sql = """
                  INSERT INTO dawa.clientes (nombre, ruc_cc, telefono, fecing)
                  VALUES (%s, %s, %s, %s) \
                  """
            record = (nombre, ruc_cc, telefono, date.today())
            result_insert = DataBaseHandle.ExecuteNonQuery(sql, record)

            if result_insert['result']:
                result = True
                data = result_insert['data']
            else:
                message = result_insert['message']

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al crear cliente -> " + err.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def listar_clientes(skip=0, limit=10):

        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT id, nombre, ruc_cc, telefono, fecing
                  FROM dawa.clientes
                  ORDER BY id
                  OFFSET %s LIMIT %s \
                  """
            record = (skip, limit)
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
    def obtener_cliente(cliente_id):

        try:
            result = False
            data = None
            message = None

            sql = """
                  SELECT id, nombre, ruc_cc, telefono, fecing
                  FROM dawa.clientes
                  WHERE id = %s \
                  """
            record = (cliente_id,)
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
    def actualizar_cliente(cliente_id, nombre=None, ruc_cc=None, telefono=None):

        try:
            result = False
            data = None
            message = None

            campos = []
            valores = []

            if nombre is not None:
                campos.append("nombre = %s")
                valores.append(nombre)
            if ruc_cc is not None:
                campos.append("ruc_cc = %s")
                valores.append(ruc_cc)
            if telefono is not None:
                campos.append("telefono = %s")
                valores.append(telefono)

            if not campos:
                message = "No hay campos para actualizar"
                return internal_response(False, None, message)

            valores.append(cliente_id)

            sql = f"""
                UPDATE dawa.clientes
                SET {', '.join(campos)}
                WHERE id = %s
            """

            result_update = DataBaseHandle.ExecuteNonQuery(sql, tuple(valores))

            if result_update['result']:
                result = True
                data = cliente_id
            else:
                message = result_update['message']

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al actualizar cliente -> " + err.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def eliminar_cliente(cliente_id):

        try:
            result = False
            data = None
            message = None

            sql = """
                  DELETE \
                  FROM dawa.clientes
                  WHERE id = %s \
                  """
            record = (cliente_id,)
            result_delete = DataBaseHandle.ExecuteNonQuery(sql, record)

            if result_delete['result']:
                result = True
                data = cliente_id
            else:
                message = result_delete['message']

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al eliminar cliente -> " + err.__str__()
        finally:
            return internal_response(result, data, message)