#Permitir conectarme a una base de datos PostgreSQl
import psycopg2
import psycopg2.extras
from psycopg2.extras import RealDictCursor

from ..general.config import Parametros
from ..general.logs import HandleLogs
from ..general.response import internal_response


def conn_db():
    return psycopg2.connect(host=Parametros.db_host,
                            port=int(Parametros.db_port),
                            user=Parametros.db_user,
                            password=Parametros.db_pass,
                            database=Parametros.db_name,
                            cursor_factory=RealDictCursor)

class DataBaseHandle:
    #Nuestros Metodos para ejecutar sentencias.
    #ejecuta metodos de tipo select
    @staticmethod
    def getRecords(query,  tamanio, record=()):
        try:
            result = False
            message = None
            data = None

            conn = conn_db()
            cursor = conn.cursor()
            if len(record) == 0:
                cursor.execute(query)
            else:
                cursor.execute(query, record)
            # tamanio es 0 todos, 1 solo uno, > 1 n registros
            if tamanio == 0:
                res = cursor.fetchall()
            elif tamanio == 1:
                res = cursor.fetchone()
            else:
                res = cursor.fetchmany(tamanio)

            data = res
            result = True
        except Exception as ex:
            HandleLogs.write_error(ex)
            message = ex.__str__()
        finally:
            cursor.close()
            conn.close()
            return internal_response(result, data, message)

    #ejecuta metodos de tipo INSERT-UPDATE-DELETE
    @staticmethod
    def ExecuteNonQuery(query, record):
        try:
            result = False
            message = None
            data = None
            conn = conn_db()
            cursor = conn.cursor()

            cursor.execute(query, record)

            if "RETURNING" in query.upper():
                row = cursor.fetchone()
                if row:
                    data = list(row.values())[0]
                conn.commit()
            elif query.upper().startswith('INSERT'):
                # Si es un INSERT simple sin RETURNING, usamos LASTVAL
                cursor.execute('SELECT LASTVAL()')
                data = cursor.fetchone()['lastval']
                conn.commit()
            else:
                # Para UPDATE/DELETE
                conn.commit()
                data = cursor.rowcount

            result = True
        except Exception as ex:
            if conn: conn.rollback()
            HandleLogs.write_error(ex)
            message = str(ex)
        finally:
            if cursor: cursor.close()
            if conn: conn.close()
            return internal_response(result, data, message)



