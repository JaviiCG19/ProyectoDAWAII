from flask import request
from flask_restful import Resource
from ..Services.empresa_service import EmpresaService
from ..Model.Request.empresa_request import EmpresaRequest
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token

class EmpresaComponent(Resource):

    @valida_api_token
    def get(self, id=None):
        """
        Maneja el listado normal, la búsqueda por ID y la papelera.
        """
        try:
            if id:
                resultado = EmpresaService.obtener_por_id(id)
            else:
                ver_eliminados = request.args.get('eliminados') == 'true'
                if ver_eliminados:
                    resultado = EmpresaService.listar_eliminados()
                else:
                    resultado = EmpresaService.listar_empresas()

            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def post(self, id=None):
        """
        Creación de empresa y manejo de restauración.
        """
        if id and "restaurar" in request.path:
            resultado = EmpresaService.restaurar_empresa(id)
            return resultado, 200 if resultado['result'] else 500

        try:
            data = request.get_json()
            errors = EmpresaRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = EmpresaService.crear_empresa(data)
            return resultado, 201 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def put(self, id):
        """
        Edición de datos de empresa.
        """
        try:
            data = request.get_json()
            errors = EmpresaRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = EmpresaService.actualizar_empresa(id, data)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def delete(self, id):
        """
        Borrado lógico.
        """
        try:
            resultado = EmpresaService.eliminar_empresa(id)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500