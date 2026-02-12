from flask import make_response, jsonify
import json

def response_inserted(datos):
    response_data = {
        'result': True,
        'message': "Registro Insertado con éxito",
        'data': datos,
        'status_code': 201,
    }
    json_str = json.dumps(response_data, default=str, ensure_ascii=False)
    return make_response(json_str, 201, {'Content-Type': 'application/json'})


def response_not_found():
    response_data = {
        'result': False,
        'message': "No hay datos para la consulta",
        'data': {},
        'status_code': 404,
    }
    json_str = json.dumps(response_data, default=str, ensure_ascii=False)
    return make_response(json_str, 404, {'Content-Type': 'application/json'})


def response_success(datos):
    response_data = {
        'result': True,
        'message': "Exitoso",
        'data': datos,
        'status_code': 200,
    }
    json_str = json.dumps(response_data, default=str, ensure_ascii=False)
    return make_response(json_str, 200, {'Content-Type': 'application/json'})


def response_error(mensaje):
    response_data = {
        'result': False,
        'message': mensaje,
        'data': {},
        'status_code': 500,
    }
    json_str = json.dumps(response_data, default=str, ensure_ascii=False)
    return make_response(json_str, 500, {'Content-Type': 'application/json'})


def response_unauthorize():
    response_data = {
        'result': False,
        'message': "Acceso No autorizado",
        'data': {},
        'status_code': 401,
    }
    json_str = json.dumps(response_data, default=str, ensure_ascii=False)
    return make_response(json_str, 401, {'Content-Type': 'application/json'})


def response_conflict(mensaje):
    response_data = {
        'result': False,
        'message': mensaje,
        'data': {},
        'status_code': 409,
    }
    json_str = json.dumps(response_data, default=str, ensure_ascii=False)
    return make_response(json_str, 409, {'Content-Type': 'application/json'})


def internal_response(result, datos, mensaje):
    return {
        'result': result,
        'data': datos,
        'message': mensaje
    }