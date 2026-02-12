from datetime import date
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response


class ClienteComponent:

    @staticmethod
    def crear_cliente(idlocal, nombre, ruc_cc, telefono): # Agregado idlocal
        # Inicialización segura
        result = False
        data = None
        message = None

        try:
            sql = """
                  INSERT INTO dawa.clientes (idlocal, nombre, ruc_cc, telefono, fecing)
                  VALUES (%s, %s, %s, %s, %s)
                  """
            record = (idlocal, nombre, ruc_cc, telefono, date.today())
            result_insert = DataBaseHandle.ExecuteNonQuery(sql, record)

            if result_insert['result']:
                result = True
                data = result_insert['data']
            else:
                message = result_insert['message']

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error al crear cliente -> " + str(err)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def listar_clientes(idlocal, skip=0, limit=10):
        # Inicialización segura
        result = False
        data = None
        message = None

        try:
            # Ahora filtramos directamente en la tabla clientes
            sql = """
                  SELECT id, idlocal, nombre, ruc_cc, telefono, fecing
                  FROM dawa.clientes
                  WHERE idlocal = %s
                  ORDER BY id
                  OFFSET %s LIMIT %s
                  """
            record = (idlocal, skip, limit)
            result_query = DataBaseHandle.getRecords(sql, 0, record)

            if result_query['result']:
                data = result_query['data']
                result = True
            else:
                message = result_query.get('message', "No se encontraron clientes")

        except Exception as ex:
            HandleLogs.write_error(ex)
            message = str(ex)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def obtener_cliente(cliente_id):
        # Inicialización segura
        result = False
        data = None
        message = None

        try:
            sql = """
                  SELECT id, idlocal, nombre, ruc_cc, telefono, fecing
                  FROM dawa.clientes
                  WHERE id = %s
                  """
            record = (cliente_id,)
            result_query = DataBaseHandle.getRecords(sql, 1, record)

            if result_query['result']:
                data = result_query['data']
                result = True
            else:
                message = result_query.get('message', "Cliente no encontrado")

        except Exception as ex:
            HandleLogs.write_error(ex)
            message = str(ex)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def actualizar_cliente(cliente_id, idlocal=None, nombre=None, ruc_cc=None, telefono=None):
        # Inicialización segura
        result = False
        data = None
        message = None

        try:
            campos = []
            valores = []

            if idlocal is not None:
                campos.append("idlocal = %s")
                valores.append(idlocal)
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
            message = "Error al actualizar cliente -> " + str(err)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def eliminar_cliente(cliente_id):
        # Inicialización segura
        result = False
        data = None
        message = None

        try:
            sql = """
                  DELETE FROM dawa.clientes
                  WHERE id = %s
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
            message = "Error al eliminar cliente -> " + str(err)
        finally:
            return internal_response(result, data, message)