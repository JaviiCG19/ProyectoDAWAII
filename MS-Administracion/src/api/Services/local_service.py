from ...utils.database.connection_db import DataBaseHandle
from datetime import datetime

class LocalService:
    @staticmethod
    def listar_por_empresa(id_cia):
        """
        CORRECCIÓN:
        Filtramos estrictamente por 'idcia' para asegurar que un restaurante
        solo vea sus propias sucursales y no las de la competencia.
        """
        query = """
            SELECT id, idcia, detalle, direccion, totmesas 
            FROM dawa.locales 
            WHERE idcia = %s AND fecact IS NOT NULL 
            ORDER BY id
        """
        return DataBaseHandle.getRecords(query, 0, (id_cia,))

    @staticmethod
    def obtener_local_por_id(id_local):
        """Consulta un local específico por su ID único."""
        query = "SELECT id, idcia, detalle, direccion, totmesas FROM dawa.locales WHERE id = %s"
        return DataBaseHandle.getRecords(query, 1, (id_local,))

    @staticmethod
    def crear_local(data):
        """
        CORRECCIÓN
        Se elimina el valor por defecto en 'totmesas'. Ahora el campo es OBLIGATORIO
        para definir la capacidad real de la sucursal desde su creación.
        Usa RETURNING id para facilitar la vinculación inmediata en el Front-end.
        """
        query = """
            INSERT INTO dawa.locales (idcia, detalle, direccion, totmesas, fecact)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        """
        record = (
            data['idcia'],
            data['detalle'],
            data['direccion'],
            data['totmesas'], # Dato obligatorio enviado desde el Request validado
            datetime.now()
        )
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def actualizar_local(id_local, data):
        """
        Actualiza la información técnica del local, incluyendo el aforo (totmesas),
        manteniendo la trazabilidad con 'fecact'.
        """
        query = """
            UPDATE dawa.locales 
            SET idcia=%s, detalle=%s, direccion=%s, totmesas=%s, fecact=%s
            WHERE id = %s
        """
        record = (
            data['idcia'],
            data['detalle'],
            data['direccion'],
            data['totmesas'],
            datetime.now(),
            id_local
        )
        return DataBaseHandle.ExecuteNonQuery(query, record)

    @staticmethod
    def eliminar_local(id_local):
        """
        BORRADO LÓGICO:
        Esto oculta el local del listado activo sin destruir la integridad referencial
        de ventas o reservas asociadas.
        """
        query = "UPDATE dawa.locales SET fecact = NULL WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (id_local,))

    @staticmethod
    def restaurar_local(id_local):
        """
        Permite recuperar un local previamente "borrado" reasignando una
        fecha de actualización activa.
        """
        query = "UPDATE dawa.locales SET fecact = %s WHERE id = %s"
        return DataBaseHandle.ExecuteNonQuery(query, (datetime.now(), id_local))