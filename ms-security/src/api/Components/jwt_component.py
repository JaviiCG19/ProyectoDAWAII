from datetime import datetime, timedelta
import jwt
import pytz

from ...utils.general.config import Parametros
from ...utils.general.logs import HandleLogs


class JwtComponent:
    # Metodo para crear o generar un token
    @staticmethod
    def token_generate(p_user):
        respuesta = None
        try:
            timezone = pytz.timezone('America/Guayaquil')
            fecha_expiracion = datetime.now(tz=timezone) + timedelta(minutes=15)

            payload = {
                'iat': datetime.now(tz=timezone),
                'exp': fecha_expiracion,
                'username': p_user
            }
            token_encoded = jwt.encode(payload, Parametros.secret_jwt, 'HS256')
            respuesta = {
                "token": token_encoded,
                "token_exp": int(fecha_expiracion.timestamp() * 1000)
            }

            HandleLogs.write_log("Token Generado exitosamente")

        except Exception as err:
            HandleLogs.write_error("Ocurrio un error al generar el token " + err.__str__())
        finally:
            return respuesta

    # Metodo para validar token
    @staticmethod
    def token_validate(p_token):
        respuesta = False
        try:
            resp_jwt = jwt.decode(p_token, Parametros.secret_jwt, algorithms=['HS256'])
            if resp_jwt is not None:
                respuesta = True

        except Exception as err:
            HandleLogs.write_error("Error al validar el token -> " + err.__str__())
        finally:
            return respuesta

