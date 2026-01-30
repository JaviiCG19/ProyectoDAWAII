#importar las clases que vamos a necesitar
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
                SELECT roles, detalle
                FROM dawa.usuarios
                WHERE nombre = %s
                AND clave = %s
                AND estado = 0;
            """
            record = (p_user, p_password)
            # Buscamos un solo registro
            result_login = DataBaseHandle.getRecords(sql, 1, record)

            if result_login['result']:
                # Si existe la data, significa que las credenciales son correctas
                if result_login['data']:
                    user_info = result_login['data']

                    # 2. Generamos el Token pasándole quizás más contexto si tu componente lo permite
                    token = JwtComponent.token_generate(p_user)
                    if token is None:
                        message = "Error al generar el Token"
                    else:
                        result = True
                        # 3. Construimos el objeto con toda la información solicitada
                        data = {
                            "token": token,
                            "user_name": user_info['detalle'],
                            "user_role": user_info['roles']
                        }
                else:
                    message = "Credenciales Inválidas"
            else:
                message = result_login['message']
        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error en Login -> " + err.__str__()
        finally:
            return internal_response(result, data, message)


