from marshmallow import Schema, fields, validate

class PromocionRequest(Schema):

    # Con idlocal obligatorio, aseguramos que el Admin de Sucursal
    # solo gestione lo que le corresponde.
    idlocal = fields.Int(
        required=True,
        error_messages={"required": "El ID del local es obligatorio para el aislamiento de datos."}
    )

    # Evitamos errores de desbordamiento en la base de datos (SQL varchar/character)
    nombre = fields.Str(
        required=True,
        validate=validate.Length(max=50),
        error_messages={"required": "El nombre de la promoción es obligatorio."}
    )

    descripcion = fields.Str(validate=validate.Length(max=150))

    # Validamos que el descuento sea un porcentaje real (0-100%).
    descuento = fields.Float(
        required=True,
        validate=validate.Range(min=0, max=100),
        error_messages={"required": "El porcentaje de descuento debe estar entre 0 y 100."}
    )

    # Validamos vigencia: Marshmallow asegura el formato YYYY-MM-DD antes de llegar al SQL.
    fec_inicio = fields.Date(required=True)
    fec_fin = fields.Date(required=True)