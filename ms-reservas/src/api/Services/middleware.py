from functools import wraps
from flask import request
from ...utils.general.response import response_unauthorize
from ..Components.jwt_component import JwtComponent


def valida_api_token(f):

    @wraps(f)
    def decorated(*args, **kwargs):
        # TEMPORAL: autenticación desactivada para pruebas locales
        return f(*args, **kwargs)  # ← Descomenta esta línea y comenta las siguientes 4

        # token = request.headers.get('tokenapp')
        # if token is None:
        #     return response_unauthorize()
        #
        # if not JwtComponent.token_validate(token):
        #     return response_unauthorize()
        #
        # return f(*args, **kwargs)

    return decorated