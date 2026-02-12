from flask_restful import Resource
from flask import request
from datetime import datetime
from ..Components.mesa_component import MesaComponent
from ...utils.general.logs import HandleLogs
from ...utils.general.response import response_error, response_success, response_not_found
from ..Services.middleware import valida_api_token


class MesaDisponibleService(Resource):

    @staticmethod
    @valida_api_token
    def get(fecha):
        """
        Obtener mesas disponibles para una fecha
        Query params opcionales:
        - franja_id: ID de la franja horaria
        - idlocal: ID del local
        """
        try:
            HandleLogs.write_log(f"Servicio para obtener mesas disponibles en {fecha} ejecutado")

            # Validar formato de fecha
            try:
                fecha_obj = datetime.strptime(fecha, '%Y-%m-%d').date()
            except ValueError:
                return response_error("Formato de fecha inválido. Use YYYY-MM-DD")

            # Obtener parámetros opcionales
            franja_id = request.args.get('franja_id', type=int)
            idlocal = request.args.get('idlocal', type=int)

            resultado = MesaComponent.mesas_disponibles_por_fecha(fecha_obj, franja_id, idlocal)

            if resultado['result']:
                return response_success(resultado['data'])
            else:
                return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())


class MesaListService(Resource):

    @staticmethod
    @valida_api_token
    def get():
        """
        Listar todas las mesas
        Query params opcionales:
        - idlocal: ID del local
        """
        try:
            HandleLogs.write_log("Servicio para listar todas las mesas ejecutado")

            idlocal = request.args.get('idlocal', type=int)

            if idlocal:
                sql = """
                      SELECT m.id, m.numero, m.maxper, m.idlocal, m.estado
                      FROM dawa.mesas m
                      WHERE m.estado = 0 \
                        AND m.idlocal = %s
                      ORDER BY m.numero \
                      """
                from ..Components.mesa_component import DataBaseHandle
                resultado = DataBaseHandle.getRecords(sql, 0, (idlocal,))

                if resultado['result']:
                    return response_success(resultado['data'])
                else:
                    return response_not_found()
            else:
                resultado = MesaComponent.listar_todas_mesas()

                if resultado['result']:
                    return response_success(resultado['data'])
                else:
                    return response_not_found()

        except Exception as err:
            HandleLogs.write_error(err)
            return response_error(err.__str__())