import os

from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_swagger_ui import get_swaggerui_blueprint

from src.api.Routes.routes import load_routes
from src.utils.general.logs import HandleLogs

FRONTEND_ORIGIN = os.environ.get('FRONTEND_URL', '*')

app = Flask(__name__)
CORS(app,
     resources={r"/*": {
         "origins": [FRONTEND_ORIGIN],
         "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
         "allow_headers": [
             "Content-Type",
             "Authorization",
             "tokenapp",
             "X-Requested-With"
         ],
         "supports_credentials": False
     }})
api = Api(app)
load_routes(api)

#definiciones del swagger
SWAGGER_URL = '/ws/ms-sec/'
API_URL = '/static/swagger.json'

SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(SWAGGER_URL, API_URL,
                                              config={
                                                  'app_name': 'ms-sec-restfullapi'
                                              })

app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)

if __name__ == '__main__':
    try:
        HandleLogs.write_log("Servicio Iniciado puerto 10100")
        port_os = int(os.environ.get('PORT', 10100))
        #Ejecutar el servidor escuchando metodos http
        app.run(debug=True, host='0.0.0.0', port=port_os, threaded=True)

    except Exception as err:
        HandleLogs.write_error(err)
    finally:
        HandleLogs.write_log("Servicio Finalizado")
