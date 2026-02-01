from flask import request
from flask_restful import Resource
from ..Services.empresa_service import EmpresaService
from ..Model.Request.empresa_request import EmpresaRequest
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token

class EmpresaComponent(Resource):
    @valida_api_token # El backend ahora valora el token para listar empresas
    def get(self):
        """
        Este metodo lista las empresas/clientes del sistema.
        Solo lo usa el Administrador Global de la plataforma para ver
        quiénes están registrados.
        """
        try:
            resultado = EmpresaService.listar_empresas()
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token # Protección para la creación de nuevas entidades
    def post(self):
        """
        CORRECCIÓN
        Aquí es donde nace el 'idcia'. Al crear la empresa, el sistema
        genera el ID que luego usará el Gerente para ver su Dashboard
        y el Admin de Sucursal para ver sus locales.
        """
        try:
            data = request.get_json()

            # Validación estricta del esquema (RUC, Nombre, Representante)
            errors = EmpresaRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = EmpresaService.crear_empresa(data)
            return resultado, 201 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500