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
    def resetPassword(user_login, new_password):
        # Este se usa para "Recuperar" (sin saber la anterior)
        # Nota: Aquí deberías validar un código enviado al correo previamente
        try:
            new_hash = generate_password_hash(new_password, method='scrypt')
            sql = "UPDATE dawa.tb_user SET user_password = %s WHERE user_login = %s;"
            return DataBaseHandle.ExecuteNonQuery(sql, (new_hash, user_login))
        except Exception as err:
            HandleLogs.write_error(err)
            return {'result': False, 'message': str(err)}