#importar las clases que vamos a necesitar
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
            # Logica
            sql = """
                SELECT * FROM dawa.tb_user WHERE user_state = true;
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
