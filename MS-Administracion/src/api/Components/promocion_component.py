from flask import request
from flask_restful import Resource
from ..Services.promocion_service import PromocionService
from ..Model.Request.promocion_request import PromocionRequest
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token

class PromocionComponent(Resource):

    @valida_api_token
    def get(self, id=None):
        """
        Obtiene una promoción o lista las promociones de un local.
        Soporta papelera con ?eliminados=true
        """
        try:
            if id:
                resultado = PromocionService.obtener_por_id(id)
            else:
                id_local = request.args.get('idlocal')
                ver_eliminados = request.args.get('eliminados') == 'true'

                if not id_local:
                    return {"result": False, "message": "ID de local requerido"}, 400

                if ver_eliminados:
                    resultado = PromocionService.listar_eliminados_por_local(id_local)
                else:
                    resultado = PromocionService.listar_por_local(id_local)

            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def post(self, id=None):
        """
        Crea una promoción o restaura una eliminada.
        """
        if id and "restaurar" in request.path:
            return PromocionService.restaurar_promocion(id), 200

        try:
            data = request.get_json()
            errors = PromocionRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = PromocionService.crear_promocion(data)
            return resultado, 201 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def put(self, id):
        """
        Edita una promoción activa.
        """
        try:
            data = request.get_json()
            errors = PromocionRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = PromocionService.actualizar_promocion(id, data)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def delete(self, id):
        """
        Borrado lógico de promociones.
        """
        try:
            resultado = PromocionService.eliminar_promocion(id)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500