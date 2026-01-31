from werkzeug.security import generate_password_hash, check_password_hash
from ...utils.database.database_handle import DataBaseHandle
from ...utils.general.logs import HandleLogs


class RecoveryComponent:

    @staticmethod
    def changePassword(user_id, old_password, new_password):
        try:
            # 1. Obtener la clave actual
            sql_check = "SELECT clave FROM dawa.usuarios WHERE id = %s;"
            res = DataBaseHandle.getRecords(sql_check, 1, (user_id,))

            if not res['result'] or not res['data']:
                return {'result': False, 'message': "Usuario no encontrado"}

            # 2. Validar que la clave vieja coincida
            if not check_password_hash(res['data']['clave'], old_password):
                return {'result': False, 'message': "La contraseña actual es incorrecta"}

            # 3. Hashear la nueva y actualizar
            new_hash = generate_password_hash(new_password, method='scrypt')
            sql_update = "UPDATE dawa.usuarios SET clave = %s WHERE id = %s;"
            return DataBaseHandle.ExecuteNonQuery(sql_update, (new_hash, user_id))

        except Exception as err:
            HandleLogs.write_error(err)
            return {'result': False, 'message': str(err)}

    @staticmethod
    def resetPassword(usr_nombre, usr_respuesta, new_password):
        try:
            # 1. Traer la respuesta secreta hasheada de la DB
            sql = "SELECT respuesta FROM dawa.usuarios WHERE nombre = %s AND estado = 0;"
            res = DataBaseHandle.getRecords(sql, 1, (usr_nombre,))

            if not res['result'] or not res['data']:
                return {'result': False, 'message': "Usuario no encontrado o inactivo"}

            hash_respuesta_db = res['data']['respuesta']

            # 2. Verificar si la respuesta es correcta (ignorando mayúsculas/minúsculas)
            if check_password_hash(hash_respuesta_db, usr_respuesta.lower().strip()):
                # 3. Si es correcta, hashear la nueva clave y actualizar
                new_hash = generate_password_hash(new_password, method='scrypt')
                sql_update = "UPDATE dawa.usuarios SET clave = %s WHERE nombre = %s;"
                return DataBaseHandle.ExecuteNonQuery(sql_update, (new_hash, usr_nombre))
            else:
                return {'result': False, 'message': "La respuesta a la pregunta de seguridad es incorrecta"}

        except Exception as err:
            HandleLogs.write_error(err)
            return {'result': False, 'message': str(err)}

