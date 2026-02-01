from flask import request
from flask_restful import Resource
from ..Services.promocion_service import PromocionService
from ..Model.Request.promocion_request import PromocionRequest
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token


class PromocionComponent(Resource):

    @valida_api_token  # El backend ahora valora el token para listar promociones
    def get(self, id=None):
        """
        CORRECCIÓN
        Solo permitimos listar promociones vinculadas al 'idlocal' del administrador
        que tiene la sesión activa.
        """
        try:
            if id:
                resultado = PromocionService.obtener_por_id(id)
            else:
                # El ID se recupera del localStorage del Front-end
                id_local = request.args.get('idlocal')
                if not id_local:
                    return {"result": False,
                            "message": "Seguridad: ID de local requerido para filtrar promociones"}, 400
                resultado = PromocionService.listar_por_local(id_local)

            return resultado, 200 if resultado['result'] else 404
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token  # Seguridad para la creación de ofertas locales
    def post(self):
        """
       Aqui el Admin de Sucursal crea promociones locales.
        Validamos integridad mediante PromocionRequest.
        """
        try:
            data = request.get_json()
            # Validamos campos como fecha de vigencia y monto
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
        Metodo de Edicion.
        Permite corregir descripciones o extender fechas de vigencia.
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

    @valida_api_token  # Seguridad para el borrado lógico
    def delete(self, id):
        """
        Borrado lógico de promociones para mantener historial .
        """
        try:
            resultado = PromocionService.eliminar_promocion(id)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500