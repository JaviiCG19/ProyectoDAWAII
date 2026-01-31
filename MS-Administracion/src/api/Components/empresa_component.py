from flask import request
from flask_restful import Resource
from ..Services.empresa_service import EmpresaService
from ..Model.Request.empresa_request import EmpresaRequest


class EmpresaComponent(Resource):
    def get(self):
        """Este método GET: permitez listar las empresas existentes"""
        try:
            resultado = EmpresaService.listar_empresas()
            # Retornamos 200 si la consulta fue exitosa
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            return {"result": False, "message": str(e)}, 500

    def post(self):
        """método POST : crea la empresa"""
        try:
            data = request.get_json()

            # Validación
            errors = EmpresaRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = EmpresaService.crear_empresa(data)
            return resultado, 201
        except Exception as e:
            return {"result": False, "message": str(e)}, 500