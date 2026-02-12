from flask_restful import Resource
from ..Components.franja_component import FranjaComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success, response_not_found
from .middleware import valida_api_token


class FranjaListService(Resource):

    @staticmethod
    @valida_api_token
    def get(idlocal):
        """
        Listar franjas horarias de un local
        """
        try:
            HandleLogs.write_log(f"Servicio para listar franjas del local {idlocal} ejecutado")

            resultado = FranjaComponent.listar_franjas_por_local(idlocal)

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())