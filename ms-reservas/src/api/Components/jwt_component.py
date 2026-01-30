from datetime import datetime, timedelta, timezone
import jwt
import pytz

from ...utils.general.config import Parametros
from ...utils.general.logs import HandleLogs


class JwtComponent:

    @staticmethod
    def token_generate(p_user):
        """
        Genera un token JWT para el usuario
        """
        respuesta = None
        try:
            # Usar UTC siempre para JWT
            now_utc = datetime.now(timezone.utc)  # o datetime.utcnow() (deprecated en Python 3.12+)

            payload = {
                'iat': now_utc,
                'exp': now_utc + timedelta(days=7),  # o hours=24 para pruebas
                'username': p_user
            }
            respuesta = jwt.encode(payload, Parametros.secret_jwt, 'HS256')
            HandleLogs.write_log("Token Generado-> " + str(respuesta))

        except Exception as err:
            HandleLogs.write_error("Ocurrio un error al generar el token " + err.__str__())
        finally:
            return respuesta

    @staticmethod
    def token_validate(p_token):
        try:
            # Opcional: verbose=True para ver más detalles en excepciones
            resp_jwt = jwt.decode(
                p_token,
                Parametros.secret_jwt,
                algorithms=['HS256'],
                options={"verify_signature": True, "verify_exp": True}
            )
            HandleLogs.write_log(f"Token válido para usuario: {resp_jwt.get('username')}")
            return True

        except jwt.ExpiredSignatureError:
            HandleLogs.write_error("Token expirado (ExpiredSignatureError)")
            return False
        except jwt.InvalidTokenError as err:
            HandleLogs.write_error(f"Token inválido: {err}")
            return False
        except Exception as err:
            HandleLogs.write_error(f"Error inesperado al validar token: {err}")
            return False