from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class PromocionService:
    @staticmethod
    def listar_por_local(id_local):
        # Filtro vital para que el Restaurante A no vea las promos del B
        query = """
            SELECT id, idlocal, nombre, descripcion, descuento, fec_inicio, fec_fin 
            FROM dawa.promociones 
            WHERE idlocal = %s AND estado = 1 
            ORDER BY fec_inicio DESC
        """
        return DataBaseHandle.getRecords(query, 0, (id_local,))

    @staticmethod
    def obtener_por_id(id_promo):
        query = "SELECT id, idlocal, nombre, descripcion, descuento, fec_inicio, fec_fin FROM dawa.promociones WHERE id = %s"
        return DataBaseHandle.getRecords(query, 1, (id_promo,))

    @staticmethod
    def crear_promocion(data):
        # Estado 1 = Activa
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
    def eliminar_promocion(id_promo):
        # Borrado lógico: estado 0 = Inactiva/Borrada
        query = "UPDATE dawa.promociones SET estado = 0, fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_promo))