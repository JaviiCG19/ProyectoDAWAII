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

            # Crear el código SQL para validar

            sql = """
                SELECT clave, roles, detalle, rol_prioritario
                FROM dawa.usuarios
                WHERE nombre = %s
                AND estado = 0;
            """
            record = (p_user,)
            # Buscamos un solo registro
            result_login = DataBaseHandle.getRecords(sql, 1, record)

            if result_login['result'] and result_login['data']:
                user_info = result_login['data']
                hash_en_db = user_info['clave'].strip()  # El hash guardado (pbkdf2:sha256...)

                # 2. Comparamos matemátixcamente:
                # Flask toma p_password, la encripta igual y ve si coincide con hash_en_db
                if check_password_hash(hash_en_db, p_password):

                    # ¡Login Exitoso! Generamos Token
                    token = JwtComponent.token_generate(p_user)

                    data = {
                        "token": token,
                        "usr_name": user_info['detalle'],
                        "usr_role": user_info['roles'],
                        "usr_rolp": user_info['rol_prioritario']
                    }
                    result = True
                    message = "Login Exitoso"
                else:
                    message = "Contraseña Incorrecta"
            else:
                message = "Usuario no existe"

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error en Login -> " + err.__str__()
        finally:
            return internal_response(result, data, message)

