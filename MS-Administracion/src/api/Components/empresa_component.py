from flask import request
from flask_restful import Resource
from ..Services.empresa_service import EmpresaService
from ..Model.Request.empresa_request import EmpresaRequest
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token

class EmpresaComponent(Resource):
    @valida_api_token
    def get(self, id=None): # Agregamos id=None por si quieres buscar una sola
        """
        LISTAR: Solo empresas con estado = 1.
        """
        try:
            # Si el service devuelve un error de conexión o SQL, mandamos 500
            resultado = EmpresaService.listar_empresas()
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def post(self):
        """
        CREAR: Registra FETAC y pone estado = 1 automáticamente.
        """
        try:
            data = request.get_json()

            # CORRECCIÓN: Si el JSON viene vacío o mal formado
            if not data:
                return {"result": False, "message": "No se recibieron datos"}, 400

            errors = EmpresaRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = EmpresaService.crear_empresa(data)
            # 201 es el código estándar para "Recurso Creado"
            return resultado, 201 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def put(self, id):
        """
        EDITAR: Actualiza datos y refresca el fecact.
        """
        try:
            data = request.get_json()
            errors = EmpresaRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = EmpresaService.actualizar_empresa(id, data)
            # CORRECCIÓN: Si el resultado es exitoso 200, si no, 404 (No encontrado) o 500
            if resultado['result']:
                return resultado, 200
            return resultado, 404
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token
    def delete(self, id):
        """
        ELIMINAR: Borrado lógico (estado = 0).
        Fundamental para no romper la integridad con Locales y Usuarios.
        """
        try:
            resultado = EmpresaService.eliminar_empresa(id)
            # 200 si se desactivó correctamente
            return resultado, 200 if resultado['result'] else 404
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500