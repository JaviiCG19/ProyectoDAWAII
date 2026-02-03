from flask_restful import Resource
from flask import request
from ..Components.user_component import UserComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import (response_error, response_success,
                                       response_not_found)
from .middleware import valida_api_token


class UserService(Resource):

    @staticmethod
    @valida_api_token
    def get():
        """Obtener lista de usuarios (READ)"""
        try:
            HandleLogs.write_log("Servicio GET Users ejecutado")
            resultado = UserComponent.getAllUsers()
            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(str(err))

    @staticmethod
    @valida_api_token
    def post():
        """Crear un nuevo usuario (CREATE)"""
        try:
            HandleLogs.write_log("Servicio POST User ejecutado")
            # Obtenemos el JSON del cuerpo de la petición
            data = request.get_json()

            # Aquí deberías validar que vengan los campos obligatorios
            if not data or 'usr_nombre' not in data or 'usr_clave' not in data or 'usr_roles' not in data or 'usr_rolp' not in data:
                return response_error("Faltan datos obligatorios (login/clave)")

            resultado = UserComponent.createUser(data)

            if resultado['result']:
                return response_success(resultado['data'])  # Usamos un 201 Created
            else:
                return response_error(resultado['message'])
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(str(err))

    @staticmethod
    @valida_api_token
    def put():
        """Actualizar un usuario existente (UPDATE)"""
        try:
            HandleLogs.write_log("Servicio PUT User ejecutado")
            data = request.get_json()

            if 'usr_id' not in data:
                return response_error("El usr_id es obligatorio para actualizar")

            resultado = UserComponent.updateUser(data)

            if resultado['result']:
                return response_success(resultado['message'])
            else:
                return response_error(resultado['message'])
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(str(err))

    @staticmethod
    @valida_api_token
    def delete():
        """Eliminar (o desactivar) un usuario (DELETE)"""
        try:
            HandleLogs.write_log("Servicio DELETE User ejecutado")
            data = request.get_json()

            if 'usr_id' not in data:
                return response_error("El usr_id es obligatorio para eliminar")

            # Generalmente hacemos borrado lógico (state=false), no físico
            resultado = UserComponent.deleteUser(data['usr_id'])

            if resultado['result']:
                return response_success(resultado['message'])
            else:
                return response_error(resultado['message'])
        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(str(err))