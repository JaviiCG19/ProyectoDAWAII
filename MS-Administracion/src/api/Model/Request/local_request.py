from marshmallow import Schema, fields, validate

class LocalRequest(Schema):
    idcia = fields.Int(required=True, error_messages={"required": "El ID de compañía es obligatorio."})

    detalle = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=50),
        error_messages={"required": "El nombre del local es obligatorio."}
    )

    direccion = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=150),
        error_messages={"required": "La dirección es obligatoria."}
    )

    # CORRECCIÓN: Ahora es requerido y validamos que sea al menos 1 mesa
    totmesas = fields.Int(
        required=True,
        validate=validate.Range(min=1),
        error_messages={"required": "El total de mesas es obligatorio para la gestión de aforo."}
    )