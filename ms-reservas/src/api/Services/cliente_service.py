from flask_restful import Resource
from flask import request
from ..Components.cliente_component import ClienteComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import (response_error, response_success,
                                       response_not_found, response_inserted)
from ..Model.Request.cliente_request import ClienteCreateRequest, ClienteUpdateRequest
from ..Services.middleware import valida_api_token


class ClienteCreateService(Resource):

    @staticmethod
    @valida_api_token
    def post():
        try:
            HandleLogs.write_log("Servicio para crear cliente ejecutado")
            rq_json = request.get_json()

            new_request = ClienteCreateRequest()
            error_en_validacion = new_request.validate(rq_json)

            if error_en_validacion:
                return response_error("Error al validar el request -> " + str(error_en_validacion))

            # Ahora pasamos idlocal al componente
            resultado = ClienteComponent.crear_cliente(
                rq_json['idlocal'],
                rq_json['nombre'],
                rq_json['ruc_cc'],
                rq_json['telefono']
            )

            if resultado['result']:
                return response_inserted(resultado['data'])
            else:
                return response_error(resultado['message'])

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(str(err))


class ClienteListService(Resource):

    @staticmethod
    @valida_api_token
    def get():
        try:
            HandleLogs.write_log("Servicio para listar clientes por local ejecutado")

            idlocal = request.args.get('idlocal', type=int)
            skip = request.args.get('skip', 0, type=int)
            limit = request.args.get('limit', 10, type=int)

            if idlocal is None:
                return response_error("El parámetro 'idlocal' es requerido")

            resultado = ClienteComponent.listar_clientes(idlocal, skip, limit)

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(str(err))


class ClienteDetailService(Resource):

    @staticmethod
    @valida_api_token
    def get(cliente_id):
        try:
            HandleLogs.write_log(f"Servicio para obtener cliente {cliente_id} ejecutado")

            resultado = ClienteComponent.obtener_cliente(cliente_id)

            if resultado['result'] and resultado['data']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(str(err))

    @staticmethod
    @valida_api_token
    def put(cliente_id):
        try:
            HandleLogs.write_log(f"Servicio para actualizar cliente {cliente_id} ejecutado")
            rq_json = request.get_json()

            update_request = ClienteUpdateRequest()
            error_en_validacion = update_request.validate(rq_json)

            if error_en_validacion:
                return response_error("Error al validar el request -> " + str(error_en_validacion))

            resultado = ClienteComponent.actualizar_cliente(
                cliente_id,
                rq_json.get('idlocal'), # Ahora se puede actualizar el local
                rq_json.get('nombre'),
                rq_json.get('ruc_cc'),
                rq_json.get('telefono')
            )

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(str(err))

    @staticmethod
    @valida_api_token
    def delete(cliente_id):
        try:
            HandleLogs.write_log(f"Servicio para eliminar cliente {cliente_id} ejecutado")

            resultado = ClienteComponent.eliminar_cliente(cliente_id)

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(str(err))