import psycopg2
from psycopg2.extras import RealDictCursor

from ..general.config import Parametros
from ..general.logs import HandleLogs
from ..general.response import internal_response


def conn_db():
    return psycopg2.connect(
        host=Parametros.db_host,
        port=int(Parametros.db_port),
        user=Parametros.db_user,
        password=Parametros.db_pass,
        database=Parametros.db_name,
        cursor_factory=RealDictCursor
    )


class DataBaseHandle:

    @staticmethod
    def getRecords(query, tamanio, record=()):

        conn = None
        cursor = None

        try:
            result = False
            message = None
            data = None

            conn = conn_db()
            cursor = conn.cursor()

            if record:
                cursor.execute(query, record)
            else:
                cursor.execute(query)

            if tamanio == 0:
                data = cursor.fetchall()
            elif tamanio == 1:
                data = cursor.fetchone()
            else:
                data = cursor.fetchmany(tamanio)

            result = True

        except Exception as ex:
            HandleLogs.write_error(ex)
            message = str(ex)

        finally:
            if cursor is not None:
                cursor.close()
            if conn is not None:
                conn.close()

            return internal_response(result, data, message)

    @staticmethod
    def ExecuteNonQuery(query, record):

        conn = None
        cursor = None

        try:
            result = False
            message = None
            data = None

            conn = conn_db()
            cursor = conn.cursor()

            if record:
                cursor.execute(query, record)
            else:
                cursor.execute(query)

            if 'INSERT' in query.upper():
                cursor.execute('SELECT LASTVAL()')
                data = cursor.fetchone()['lastval']
            else:
                data = cursor.rowcount

            conn.commit()
            result = True

        except Exception as ex:
            if conn is not None:
                conn.rollback()
            HandleLogs.write_error(ex)
            message = str(ex)

        finally:
            if cursor is not None:
                cursor.close()
            if conn is not None:
                conn.close()

            return internal_response(result, data, message)