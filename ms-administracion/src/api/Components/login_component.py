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

            sql = """
                SELECT count(*) as valor,
                       roles,
                       rol_prioritario,
                       detalle
                FROM dawa.usuarios
                WHERE nombre = %s
                  AND clave = %s
                  AND estado = 0
                GROUP BY roles, rol_prioritario, detalle;
            """

            record = (p_user, p_password)
            result_login = DataBaseHandle.getRecords(sql, 1, record)

            if result_login['result']:
                if result_login['data']:
                    user_info = result_login['data']

                    token = JwtComponent.token_generate(p_user)
                    if token is None:
                        message = "Error al generar el Token"
                    else:
                        result = True

                        roles_raw = user_info['roles']
                        roles_array = [r for r in roles_raw.split(";") if r]

                        data = {
                            "token": token,
                            "user_name": user_info['detalle'],
                            "roles": roles_array,
                            "primary_role": user_info['rol_prioritario']
                        }
                else:
                    message = "Credenciales Inválidas"
            else:
                message = result_login['message']

        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error en Login -> " + str(err)
        finally:
            return internal_response(result, data, message)



