from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class PromocionService:
    @staticmethod
    def listar_por_local(id_local):
        """
        CORRECCIÓN
        Filtramos por 'idlocal' para que el Admin de Sucursal solo vea sus promociones.
        Solo mostramos las activas (estado = 1).
        """
        query = """
            SELECT id, idlocal, nombre, descripcion, descuento, fec_inicio, fec_fin 
            FROM dawa.promociones 
            WHERE idlocal = %s AND estado = 1 
            ORDER BY fec_inicio DESC
        """
        return DataBaseHandle.getRecords(query, 0, (id_local,))

    @staticmethod
    def obtener_por_id(id_promo):
        """Busca una promoción específica para edición o detalle."""
        query = "SELECT id, idlocal, nombre, descripcion, descuento, fec_inicio, fec_fin FROM dawa.promociones WHERE id = %s"
        return DataBaseHandle.getRecords(query, 1, (id_promo,))

    @staticmethod
    def crear_promocion(data):
        """
        Aquí definimos todos los campos validados por el Request:
        fechas de vigencia, descuento y el vínculo obligatorio al local.
        """
        query = """
            INSERT INTO dawa.promociones (idlocal, nombre, descripcion, descuento, fec_inicio, fec_fin, estado, fecact)
            VALUES (%s, %s, %s, %s, %s, %s, 1, %s)
        """
        record = (
            data['idlocal'], data['nombre'], data.get('descripcion', ''),
            data['descuento'], data['fec_inicio'], data['fec_fin'], datetime.now()
        )
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def actualizar_promocion(id_promo, data):
        """
         Metodo para editar promociones.

        """
        query = """
            UPDATE dawa.promociones 
            SET nombre = %s, descripcion = %s, descuento = %s, fec_inicio = %s, fec_fin = %s, fecact = %s 
            WHERE id = %s
        """
        record = (
            data['nombre'], data.get('descripcion', ''), data['descuento'],
            data['fec_inicio'], data['fec_fin'], datetime.now(), id_promo
        )
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def eliminar_promocion(id_promo):
        """
        BORRADO LOGICO: Estado 0.
        validacion de cada acción se mantine el registro como 'inactivo'
        permite auditoría y reportes para el Gerente.
        """
        query = "UPDATE dawa.promociones SET estado = 0, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_promo))