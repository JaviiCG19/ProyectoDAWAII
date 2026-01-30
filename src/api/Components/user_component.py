#importar las clases que vamos a necesitar
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response
from werkzeug.security import generate_password_hash

class UserComponent:

    @staticmethod

    def getAllUsers():
        try:
            result = False
            data = None
            message = None
            # Logica
            sql = """
                SELECT nombre,detalle,roles,rol_prioritario,estado FROM dawa.usuarios WHERE estado = 0;
            """
            result_user = DataBaseHandle.getRecords(sql, 0)
            if result_user['result']:
                data = result_user['data']
                result = True
            else:
                message = result_user['message']
        except Exception as ex:
            HandleLogs.write_error(ex)
            message = ex.__str__()
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def createUser(user_data):
        try:
            result = False
            message = None
            data = None

            # ENCRIPTACIÓN AQUÍ:
            # El método pbkdf2:sha256 es muy seguro y añade un "salt" automático
            pass_encriptada = generate_password_hash(user_data['usr_clave'], method='pbkdf2:sha256')

            sql = """
                    INSERT INTO dawa.usuarios (nombre,clave,detalle,roles,rol_prioritario,respuesta,estado)
                    VALUES (%s, %s, %s, %s, %s, %s, 0)
                    RETURNING user_id;
                """
            # Tip: Recuerda encriptar la password antes de enviarla aquí en un entorno real
            record = (
                user_data['usr_nombre'],
                pass_encriptada,
                user_data.get('usr_detalle', ''),
                user_data.get('usr_roles', '0;'),
                user_data.get('usr_rolp','0'),
                user_data.get('usr_respuesta', '')
            )

            res = DataBaseHandle.ExecuteNonQuery(sql, record)  # Asumiendo que tienes este método

            if res['result']:
                result = True
                data = {'id_generado': res['data']}  # Si tu DB handle devuelve el ID
                message = "Usuario creado exitosamente"
            else:
                message = res['message']

        except Exception as err:
            HandleLogs.write_error(err)
            message = str(err)
        finally:
            return {'result': result, 'data': data, 'message': message}

    @staticmethod
    def updateUser(user_data):
        try:
            result = False
            message = None

            sql = """
                    UPDATE dawa.usuarios
                    SET detalle = %s, roles = %s, rol_prioritario = %s, respuesta = %s
                    WHERE id = %s;
                """
            record = (
                user_data.get('usr_detalle'),
                user_data.get('usr_roles'),
                user_data.get('usr_rolp'),
                user_data.get('usr_respuesta'),
                user_data['usr_id']
            )

            res = DataBaseHandle.ExecuteNonQuery(sql, record)

            if res['result']:
                result = True
                message = "Usuario actualizado correctamente"
            else:
                message = "Error al actualizar o usuario no encontrado"

        except Exception as err:
            # ... manejo de error estándar ...
            pass
        finally:
            return {'result': result, 'message': message}

    @staticmethod
    def deleteUser(usr_id):
        try:
            result = False
            message = None

            # Borrado Lógico (Recomendado)
            sql = "UPDATE dawa.usuarios SET estado = 9 WHERE id = %s"

            record = (usr_id,)
            res = DataBaseHandle.ExecuteNonQuery(sql, record)

            if res['result']:
                result = True
                message = "Usuario eliminado (desactivado) correctamente"
            else:
                message = "Error al eliminar usuario"
        except Exception as err:
            HandleLogs.write_error(err)
            message = str(err)
        finally:
            return {'result': result, 'message': message}