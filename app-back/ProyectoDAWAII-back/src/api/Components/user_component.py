#importar las clases que vamos a necesitar
from werkzeug.security import generate_password_hash
from ...utils.database.connection_db import DataBaseHandle
from ...utils.general.logs import HandleLogs
from ...utils.general.response import internal_response

class UserComponent:

    @staticmethod
    def getAllUsers():
        try:
            result = False
            data = None
            message = None

            # Agregamos id, id_res e id_local a la consulta
            # id_res es necesario para cargar el combo de empresas
            # id_local es necesario para cargar el combo de sucursales
            sql = """
                SELECT 
                    id, 
                    nombre, 
                    detalle, 
                    roles, 
                    rol_prioritario, 
                    id_res, 
                    id_local, 
                    estado 
                FROM dawa.usuarios 
                WHERE estado = 0 
                ORDER BY id DESC;
            """

            result_user = DataBaseHandle.getRecords(sql, 0)

            if result_user['result']:
                data = result_user['data']
                result = True
            else:
                message = result_user['message']

        except Exception as ex:
            HandleLogs.write_error(ex)
            message = str(ex)
        finally:
            return internal_response(result, data, message)

    @staticmethod
    def createUser(user_data):
        try:
            result = False
            message = None
            data = None

            rol = int(user_data.get('usr_rolp'))

            # ==========================
            # NORMALIZACIÓN (CLAVE)
            # ==========================
            id_res = user_data.get('usr_id_res')
            id_local = user_data.get('usr_id_local')

            id_res = None if id_res in ("", 0, "0") else id_res
            id_local = None if id_local in ("", 0, "0") else id_local

            # ==========================
            # VALIDACIÓN DE ROL
            # ==========================
            error = UserComponent._validate_role_scope(
                rol=rol,
                id_res=id_res,
                id_local=id_local
            )
            if error:
                return {'result': False, 'message': error}

            # ==========================
            # PASSWORD
            # ==========================
            pass_encriptada = generate_password_hash(
                user_data['usr_clave'],
                method='pbkdf2:sha256'
            )

            sql = """
                    INSERT INTO dawa.usuarios
                    (nombre, clave, detalle, roles, rol_prioritario, respuesta, estado, id_local, id_res)
                    VALUES (%s, %s, %s, %s, %s, %s, 0, %s, %s)
                    RETURNING id;
                """

            record = (
                user_data['usr_nombre'],
                pass_encriptada,
                user_data.get('usr_detalle', ''),
                user_data.get('usr_roles', ''),
                rol,
                user_data.get('usr_respuesta', ''),
                id_local,
                id_res
            )

            res = DataBaseHandle.ExecuteNonQuery(sql, record)

            if res['result']:
                result = True
                data = {'id_generado': res['data']}
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

            rol = int(user_data.get('usr_rolp'))

            id_res = user_data.get('usr_id_res')
            id_local = user_data.get('usr_id_local')

            id_res = None if id_res in ("", 0, "0") else id_res
            id_local = None if id_local in ("", 0, "0") else id_local

            error = UserComponent._validate_role_scope(
                rol=rol,
                id_res=id_res,
                id_local=id_local
            )
            if error:
                return {'result': False, 'message': error}

            sql = """
                    UPDATE dawa.usuarios
                    SET
                        detalle = %s,
                        roles = %s,
                        rol_prioritario = %s,
                        respuesta = %s,
                        id_local = %s,
                        id_res = %s
                    WHERE id = %s;
                """

            record = (
                user_data.get('usr_detalle', ''),
                user_data.get('usr_roles', ''),
                rol,
                user_data.get('usr_respuesta', ''),
                id_local,
                id_res,
                user_data['usr_id']
            )

            res = DataBaseHandle.ExecuteNonQuery(sql, record)

            if res['result']:
                result = True
                message = "Usuario actualizado correctamente"
            else:
                message = "Error al actualizar usuario"

        except Exception as err:
            HandleLogs.write_error(err)
            message = str(err)

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

    @staticmethod
    def _validate_role_scope(rol, id_res, id_local):

        # ADMIN GENERAL
        if rol == 1:
            if id_res is not None or id_local is not None:
                return "Administrador no debe tener restaurante ni sucursal"

        # GERENTE
        elif rol == 2:
            if id_res is None:
                return "Gerente debe tener restaurante asignado"
            if id_local is not None:
                return "Gerente no debe tener sucursal"

        # ADMIN SUCURSAL / RECEPCIÓN / MESERO
        elif rol in (3, 4, 5):
            if id_res is None or id_local is None:
                return "Este rol requiere restaurante y sucursal"

        else:
            return "Rol no válido"

        return None
