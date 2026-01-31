from marshmallow import Schema, fields, validate


class PromocionRequest(Schema):
    # Obligatorio: a qué local pertenece la promo
    idlocal = fields.Int(required=True, error_messages={"required": "El ID del local es obligatorio."})

    # El nombre no puede pasar de 50 caracteres
    nombre = fields.Str(required=True, validate=validate.Length(max=50))

    # Descripción opcional
    descripcion = fields.Str(validate=validate.Length(max=150))

    # El descuento debe ser un número entre 0 y 100
    descuento = fields.Float(required=True, validate=validate.Range(min=0, max=100))

    # Fechas en formato YYYY-MM-DD
    fec_inicio = fields.Date(required=True)
    fec_fin = fields.Date(required=True)