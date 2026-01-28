#importar las clases que vamos a necesitar
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class LoginComponent:

    @staticmethod
    def Login(p_user, p_password):
        try:
            result = False
            data = None
            message = None

            # Crear el código SQL para validar

            sql = """
                SELECT count(*) as valor
                FROM dawa.tb_user
                WHERE user_login = %s
                AND user_password = %s
                AND user_state = true;
            """
            record = (p_user, p_password)
            result_login = DataBaseHandle.getRecords(sql, 1, record)
            if result_login['result']:
                if result_login['data']['valor'] > 0:
                    result = True
                    data = "Login Exitoso"
                else:
                    message = "Credenciales Inválidas"
            else:
                message = result_login['message']
        except Exception as err:
            HandleLogs.write_error(err)
            message = "Error en Login -> " + err.__str__()
        finally:
            return internal_response(result, data, message)


