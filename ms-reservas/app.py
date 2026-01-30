import os
from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_swagger_ui import get_swaggerui_blueprint
from src.api.Routes.routes import load_routes
from src.utils.general.logs import HandleLogs
app = Flask(__name__)
CORS(app)
api = Api(app)

# Cargar rutas
load_routes(api)

# Configuración de Swagger
SWAGGER_URL = '/api/docs'
API_URL = '/static/swagger.json'

SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': 'ms-reservas-api'
    }
)

app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)


# Ruta de health check
@app.route('/')
def health_check():
    return {
        'status': 'OK',
        'service': 'Microservicio de Reservas',
        'version': '1.0.0'
    }


if __name__ == '__main__':
    try:
        HandleLogs.write_log("Microservicio de Reservas Iniciado")
        port_os = int(os.environ.get('PORT', 5000))
        app.run(debug=False, host='0.0.0.0', port=port_os, threaded=True)

    except Exception as err:
        HandleLogs.write_error(err)
    finally:
        HandleLogs.write_log("Microservicio de Reservas Finalizado")