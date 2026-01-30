from flask_restful import Resource
from flask import request
from ..Components.roles_component import RolesComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success, response_not_found
from .middleware import valida_api_token


class RolesService(Resource):

    @staticmethod
    @valida_api_token
    def get(self):
        resultado = RolesComponent.getAllRoles()
        if resultado['result']:
            return response_success(resultado['data'])
        return response_not_found()

    @staticmethod
    @valida_api_token
    def post(self):
        data = request.get_json()
        if not data or 'nombre' not in data:
            return response_error("El campo 'nombre' es requerido")

        resultado = RolesComponent.createRole(data)
        if resultado['result']:
            return response_success(resultado['data'], "Rol creado")
        return response_error(resultado['message'])

    @staticmethod
    @valida_api_token
    def put(self):
        data = request.get_json()
        if 'id' not in data or 'nombre' not in data:
            return response_error("Faltan campos obligatorios (id, nombre)")

        resultado = RolesComponent.updateRole(data)
        if resultado['result']:
            return response_success(None, "Rol actualizado")
        return response_error(resultado['message'])

    @staticmethod
    @valida_api_token
    def delete(self):
        data = request.get_json()
        if 'id' not in data:
            return response_error("El 'id' es requerido para eliminar")

        resultado = RolesComponent.deleteRole(data['id'])
        if resultado['result']:
            return response_success(None, "Rol eliminado")
        return response_error(resultado['message'])