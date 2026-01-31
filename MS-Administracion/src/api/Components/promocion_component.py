from flask import request
from flask_restful import Resource
from ..Services.promocion_service import PromocionService
from ..Model.Request.promocion_request import PromocionRequest
from ...utils.general.logs import HandleLogs


class PromocionComponent(Resource):
    def get(self, id=None):
        try:
            if id:
                resultado = PromocionService.obtener_por_id(id)
            else:
                # Solo promociones de este local/empresa
                id_local = request.args.get('idlocal')
                if not id_local:
                    return {"result": False, "message": "ID de local requerido para filtrar promociones"}, 400
                resultado = PromocionService.listar_por_local(id_local)

            return resultado, 200 if resultado['result'] else 404
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    def post(self):
        try:
            data = request.get_json()
            # Validamos antes de enviar al servicio
            errors = PromocionRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = PromocionService.crear_promocion(data)
            return resultado, 201 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    def delete(self, id):
        try:
            resultado = PromocionService.eliminar_promocion(id)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500