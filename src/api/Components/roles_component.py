from ...utils.database.database_handle import DataBaseHandle
from ...utils.general.logs import HandleLogs

class RolesComponent:

    @staticmethod
    def getAllRoles():
        try:
            sql = "SELECT id, nombre FROM dawa.roles ORDER BY id ASC;"
            return DataBaseHandle.getRecords(sql, 0) # 0 para traer todos
        except Exception as err:
            HandleLogs.write_error(err)
            return {'result': False, 'message': str(err)}

    @staticmethod
    def createRole(data):
        try:
            sql = "INSERT INTO dawa.roles (nombre) VALUES (%s) RETURNING id;"
            record = (data['nombre'],)
            return DataBaseHandle.ExecuteNonQuery(sql, record)
        except Exception as err:
            HandleLogs.write_error(err)
            return {'result': False, 'message': str(err)}

    @staticmethod
    def updateRole(data):
        try:
            sql = "UPDATE dawa.roles SET nombre = %s WHERE id = %s;"
            record = (data['nombre'], data['id'])
            return DataBaseHandle.ExecuteNonQuery(sql, record)
        except Exception as err:
            HandleLogs.write_error(err)
            return {'result': False, 'message': str(err)}

    @staticmethod
    def deleteRole(role_id):
        try:
            sql = "DELETE FROM dawa.roles WHERE id = %s;"
            record = (role_id,)
            return DataBaseHandle.ExecuteNonQuery(sql, record)
        except Exception as err:
            HandleLogs.write_error(err)
            return {'result': False, 'message': str(err)}