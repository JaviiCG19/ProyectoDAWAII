
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class RolesComponent:

    @staticmethod
    def getAllRoles():
        try:
            result = False
            data = None
            message = None
            sql = "SELECT id, nombre FROM dawa.roles ORDER BY id ASC;"
            result_user = DataBaseHandle.getRecords(sql, 0)
            if result_user['result']:
                data = result_user['data']
                result = True
            else:
                message = result_user['message']
        except Exception as ex:
            HandleLogs.write_error(ex)
            message = ex.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def createRole(params):
        try:
            result = False
            message = None
            data = None
            if 'nombre' not in params:
                return internal_response(result, data, "El nombre del rol es requerido")

            sql = "INSERT INTO dawa.roles (nombre) VALUES (%s) RETURNING id;"
            record = (params['nombre'],)

            # Ejecutamos
            res = DataBaseHandle.ExecuteNonQuery(sql, record)

            if res['result']:
                result = True
                # res['data'] contendrá el ID devuelto por el RETURNING id o LASTVAL()
                data = {'id_generado': res['data']}
                message = "Rol creado exitosamente"
            else:
                message = res['message']

        except Exception as err:
            HandleLogs.write_error(err)
            message = str(err)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def updateRole(rol_data):
        try:
            result = False
            message = None
            data = None
            sql = "UPDATE dawa.roles SET nombre = %s WHERE id = %s;"
            record = (rol_data['nombre'], rol_data['id'])
            res = DataBaseHandle.ExecuteNonQuery(sql, record)

            if res['result']:
                result = True
                message = "Rol actualizado correctamente"
            else:
                message = "Error al actualizar o rol no encontrado"

        except Exception as err:
            HandleLogs.write_error(err)
            message = str(err)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def deleteRole(role_id):
        try:
            result = False
            message = None
            data = None
            sql = "DELETE FROM dawa.roles WHERE id = %s;"
            record = (role_id,)
            res = DataBaseHandle.ExecuteNonQuery(sql, record)

            if res['result']:
                result = True
                message = "Rol eliminado correctamente"
            else:
                message = "Error al eliminar rol"
        except Exception as err:
            HandleLogs.write_error(err)
            message = str(err)
        finally:
            return internal_response(result, data, message)