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
                            sslmode='require',
                            cursor_factory=RealDictCursor)

class DataBaseHandle:
    #Nuestros Metodos para ejecutar sentencias.
    #ejecuta metodos de tipo select
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

            if len(record) == 0:
                cursor.execute(query)
            else:
                cursor.execute(query, record)

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
            if cursor:
                cursor.close()
            if conn:
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

            if len(record) == 0:
                cursor.execute(query)
            else:
                cursor.execute(query, record)

            # 1. Obtenemos cuántas filas se vieron afectadas (útil para UPDATE/DELETE)
            rows_affected = cursor.rowcount

            if 'INSERT' in query.upper():
                # Intentar obtener el ID si la query tiene RETURNING o usamos LASTVAL
                try:
                    cursor.execute('SELECT LASTVAL()')
                    data = cursor.fetchone()['lastval']
                except:
                    data = rows_affected
            else:
                # Para UPDATE o DELETE, devolvemos el número de filas afectadas
                data = rows_affected

            # 2. ¡VITAL! Hacer commit para CUALQUIER operación de escritura
            conn.commit()
            result = True

        except Exception as ex:
            if conn:
                conn.rollback()  # Opcional: deshace cambios si hay error
            HandleLogs.write_error(ex)
            message = str(ex)
        finally:
            if cursor: cursor.close()
            if conn: conn.close()
            return internal_response(result, data, message)



