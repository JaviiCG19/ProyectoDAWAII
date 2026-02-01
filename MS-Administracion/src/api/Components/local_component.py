from flask import request
from flask_restful import Resource
from ..Services.local_service import LocalService
from ..Model.Request.local_request import LocalRequest
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token

class LocalComponent(Resource):

    @valida_api_token
    def get(self, id=None):
        """
      Filtramos por idcia para que un Gerente
        solo vea las sucursales de SU empresa.
        """
        try:
            if id:
                resultado = LocalService.obtener_local_por_id(id)
                # Si el ID no existe en DB, devolvemos 404
                return resultado, 200 if resultado['result'] else 404
            else:
                id_cia = request.args.get('idcia')
                if not id_cia:
                    return {"result": False, "message": "Seguridad: ID de compañía requerido"}, 400

                resultado = LocalService.listar_por_empresa(id_cia)
                return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def post(self, id=None):
        """
        CREACIÓN/RESTAURACIÓN:
        Al crear un local, el Service dispara la creación automática de mesas (ms-X).
        """
        # Caso de Restauración (Estado 0 -> 1)
        if id and "restaurar" in request.path:
            resultado = LocalService.restaurar_local(id)
            return resultado, 200 if resultado['result'] else 404

        try:
            data = request.get_json()
            # Validación de LocalRequest (idcia, detalle, totmesas)
            errors = LocalRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = LocalService.crear_local(data)
            # 201: Recurso creado con éxito
            return resultado, 201 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def put(self, id):
        """
       Actualiza datos y refresca FETAC.
        Si cambia 'totmesas', el Service sincroniza las mesas automáticamente.
        """
        try:
            data = request.get_json()
            errors = LocalRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = LocalService.actualizar_local(id, data)
            return resultado, 200 if resultado['result'] else 404
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def delete(self, id):
        """
        BORRADO LOGICO: Estado 0.
        Oculta el local y sus mesas sin borrar el historial.
        """
        try:
            resultado = LocalService.eliminar_local(id)
            return resultado, 200 if resultado['result'] else 404
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500