#importar las clases que vamos a necesitar
from werkzeug.security import check_password_hash, generate_password_hash
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response
from .jwt_component import JwtComponent

class LoginComponent:

    @staticmethod
    def Login(p_user, p_password):
        try:
            result = False
            data = None
            message = None

            sql = """
                SELECT 
                    id,
                    clave,
                    roles,
                    detalle,
                    rol_prioritario,
                    id_res,
                    id_local
                FROM dawa.usuarios
                WHERE nombre = %s
                AND estado = 0;
            """

            record = (p_user,)
            result_login = DataBaseHandle.getRecords(sql, 1, record)

            if result_login['result'] and result_login['data']:
                user_info = result_login['data']
                hash_en_db = user_info['clave'].strip()

                if check_password_hash(hash_en_db, p_password):

                    # Ahora auth_info recibe el diccionario {"token": ..., "token_exp": ...}
                    auth_info = JwtComponent.token_generate(p_user)

                    if auth_info:
                        data = {
                            "token": auth_info['token'],
                            "token_exp": auth_info['token_exp'], # Se envía al Frontend
                            "usr_id": user_info['id'],
                            "usr_name": user_info['detalle'],
                            "usr_role": user_info['roles'],
                            "usr_rolp": user_info['rol_prioritario'],
                            "id_res": user_info['id_res'],
                            "id_local": user_info['id_local'],
                        }

                        result = True
                        message = "Login Exitoso"
                    else:
                        message = "Error al generar el token de seguridad"
                else:
                    message = "Contraseña Incorrecta"
            else:
                message = "Usuario no existe"

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error en Login -> " + str(err)
        finally:
            return internal_response(result, data, message)


