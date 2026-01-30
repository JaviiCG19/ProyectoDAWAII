from marshmallow import Schema, fields, validate


class LocalRequest(Schema):
    # idcia es obligatorio según tu SQL
    idcia = fields.Int(required=True, error_messages={"required": "El ID de compañía es obligatorio."})

    # detalle máximo 50 caracteres
    detalle = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=50),
        error_messages={"required": "El nombre del local es obligatorio."}
    )

    # direccion máximo 150 caracteres
    direccion = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=150),
        error_messages={"required": "La dirección es obligatoria."}
    )

    # totmesas opcional, pero debe ser entero
    totmesas = fields.Int(required=False, default=1)