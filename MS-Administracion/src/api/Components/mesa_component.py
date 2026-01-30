from flask import request
from flask_restful import Resource
from ..Services.mesa_service import MesaService
from ..Model.Request.mesa_request import MesaRequest
from ...utils.general.logs import HandleLogs


class MesaComponent(Resource):
    def get(self, id_local=None):
        """Lista mesas (Si envías ID local, filtra)"""
        try:
            # Si no viene ID por URL, intentamos sacarlo de los argumentos ?idlocal=1
            id_busqueda = id_local or request.args.get('idlocal')

            if id_busqueda:
                resultado = MesaService.listar_por_local(id_busqueda)
            else:
                return {"result": False, "message": "Debe proporcionar un ID de local"}, 400

            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    def post(self):
        """Crea una nueva mesa (ADM-R03)"""
        try:
            data = request.get_json()
            # Validamos con Marshmallow
            errors = MesaRequest().validate(data)
            if errors:
                return {"result": False, "data": None, "message": errors}, 400

            resultado = MesaService.crear_mesa(data)
            return resultado, 201 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500