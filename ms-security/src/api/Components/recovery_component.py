from werkzeug.security import generate_password_hash, check_password_hash
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response, response_error, response_success

class RecoveryComponent:

    @staticmethod
    def changePassword(user_id, old_password, new_password):
        try:

            sql_check = "SELECT clave FROM dawa.usuarios WHERE id = %s;"
            res = DataBaseHandle.getRecords(sql_check, 1, (user_id,))

            if not res['result'] or not res['data']:
                return internal_response(False, None, "Usuario no encontrado")

            if not check_password_hash(res['data']['clave'], old_password):
                return internal_response(False, None,"La contraseña actual es incorrecta")

            new_hash = generate_password_hash(new_password, method='scrypt')
            sql_update = "UPDATE dawa.usuarios SET clave = %s WHERE id = %s"
            DataBaseHandle.ExecuteNonQuery(sql_update, (new_hash, int(user_id)))
            print('si')
            return internal_response(True, None, "")

        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None,str(err))

    @staticmethod
    def resetPassword(usr_nombre, usr_respuesta, new_password):
        try:
            if not usr_nombre or not usr_respuesta or not new_password:
                return internal_response(False, None, "Datos incompletos")

            sql = """
                SELECT respuesta 
                FROM dawa.usuarios 
                WHERE nombre = %s AND estado = 0;
            """
            res = DataBaseHandle.getRecords(sql, 1, (usr_nombre,))

            if not res['result'] or not res['data']:
                return internal_response(False, None, "Usuario no encontrado o inactivo")

            respuesta_db = res['data']['respuesta']

            if not respuesta_db:
                return internal_response(False, None, "Usuario sin respuesta configurada")

            if respuesta_db.strip().lower() == usr_respuesta.strip().lower():
                new_hash = generate_password_hash(new_password, method='scrypt')

                sql_update = """
                    UPDATE dawa.usuarios 
                    SET clave = %s 
                    WHERE nombre = %s;
                """
                DataBaseHandle.ExecuteNonQuery(sql_update, (new_hash, usr_nombre))

                return internal_response(True, None, "Contraseña restablecida")
            else:
                return internal_response(False, None, "Respuesta incorrecta")

        except Exception as err:
            HandleLogs.write_error(err)
            return internal_response(False, None, str(err))



