from functools import wraps
from flask import request
from ...utils.general.response import response_unauthorize
from ..Components.jwt_component import JwtComponent

def valida_api_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Validar que el token que yo recibo sea válido
        token = request.headers.get('tokenapp')
        if token is None:
            return response_unauthorize()

        if not JwtComponent.token_validate(token):
            return response_unauthorize()

        return f(*args, **kwargs)
    return decorated


