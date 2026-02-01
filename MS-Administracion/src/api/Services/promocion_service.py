from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class PromocionService:
    @staticmethod
    def listar_por_local(id_local):

        query = """
            SELECT id, idlocal, TRIM(nombre) as nombre, TRIM(descripcion) as descripcion, 
                   descuento, fec_inicio, fec_fin 
            FROM dawa.promociones 
            WHERE idlocal = %s AND estado = 1 
            ORDER BY fec_inicio DESC
        """
        return DataBaseHandle.getRecords(query, 0, (id_local,))

    @staticmethod
    def obtener_por_id(id_promo):
        query = """
            SELECT id, idlocal, TRIM(nombre) as nombre, TRIM(descripcion) as descripcion, 
                   descuento, fec_inicio, fec_fin 
            FROM dawa.promociones WHERE id = %s
        """
        return DataBaseHandle.getRecords(query, 1, (id_promo,))

    @staticmethod
    def crear_promocion(data):
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
        """Permite editar la promo manteniendo la lógica de negocio."""
        query = """
            UPDATE dawa.promociones 
            SET nombre = %s, descripcion = %s, descuento = %s, 
                fec_inicio = %s, fec_fin = %s, fecact = %s
            WHERE id = %s AND estado = 1
        """
        record = (
            data['nombre'], data.get('descripcion', ''), data['descuento'],
            data['fec_inicio'], data['fec_fin'], datetime.now(), id_promo
        )
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def eliminar_promocion(id_promo):
        # Borrado lógico: estado 0
        query = "UPDATE dawa.promociones SET estado = 0, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_promo))

    @staticmethod
    def listar_eliminados_por_local(id_local):
        """Para la papelera de promociones."""
        query = """
            SELECT id, TRIM(nombre) as nombre, descuento, fec_inicio, fec_fin 
            FROM dawa.promociones 
            WHERE idlocal = %s AND estado = 0 
            ORDER BY id DESC
        """
        return DataBaseHandle.getRecords(query, 0, (id_local,))

    @staticmethod
    def restaurar_promocion(id_promo):
        """Saca la promo de la papelera."""
        query = "UPDATE dawa.promociones SET estado = 1, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_promo))