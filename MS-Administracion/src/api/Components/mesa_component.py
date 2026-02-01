from flask import request
from flask_restful import Resource
from ..Services.mesa_service import MesaService
from ..Model.Request.mesa_request import MesaRequest
from ...utils.general.logs import HandleLogs
from ..Services.middleware import valida_api_token


class MesaComponent(Resource):

    @valida_api_token  # El backend valora el token para listar el inventario
    def get(self, id=None):
        """
        CORRECCIÓN : Aislamiento de datos.
        listamos todas las mesas del sistema. Filtramos obligatoriamente por 'idlocal'
        para que los datos de un restaurante sean PROPIOS y privados.
        """
        try:
            if id:
                resultado = MesaService.obtener_por_id(id)
            else:
                # El ID del local viene del Front (LocalStorage) como sugirió Kioz
                id_local = request.args.get('idlocal')
                if not id_local:
                    return {"result": False, "message": "Seguridad: Se requiere ID de local"}, 400
                resultado = MesaService.listar_por_local(id_local)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token  # Protección para la creación física de mesas
    def post(self, id=None):
        # El Admin de sucursal puede restaurar mesas sin crear duplicados
        if id and "restaurar" in request.path:
            return MesaService.restaurar_mesa(id), 200
        try:
            data = request.get_json()

            """
            CORRECCIÓN : 
            Ahora el esquema MesaRequest OBLIGA a enviar 'idlocal', 'numero' y 'maxper'.
            Esto permite validar que las mesas creadas no excedan el 'totmesas' del local.
            """
            errors = MesaRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            return MesaService.crear_mesa(data), 201
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token  # Agregamos la edición que Kioz pidió
    def put(self, id):
        """
        METODO PUT: Para editar los datos de la mesa (número o capacidad).
        """
        try:
            data = request.get_json()
            # Validamos que los cambios cumplan con el esquema
            errors = MesaRequest().validate(data)
            if errors:
                return {"result": False, "message": errors}, 400

            resultado = MesaService.actualizar_mesa(id, data)
            return resultado, 200 if resultado['result'] else 500
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500

    @valida_api_token  # Seguridad para el borrado lógico realizado por el Admin de Sucursal
    def delete(self, id):
        """
        CORRECCIÓN: Roles y consistencia.
        Esta acción la hace el Admin de Sucursal. Usamos borrado lógico (estado 0)
        para que el Gerente no pierda el historial de reportes.
        """
        try:
            # Se ejecuta el cambio de estado a 0 definido en el Service
            return MesaService.eliminar_mesa(id), 200
        except Exception as e:
            HandleLogs.write_error(e)
            return {"result": False, "message": str(e)}, 500