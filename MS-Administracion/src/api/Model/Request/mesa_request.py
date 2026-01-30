from marshmallow import Schema, fields, validate


class MesaRequest(Schema):
    idlocal = fields.Int(required=True, error_messages={"required": "El ID del local es obligatorio."})

    # El número de mesa en tu SQL es character(2)
    numero = fields.Str(
        required=True,
        validate=validate.Length(equal=2),
        error_messages={"required": "El número de mesa debe tener exactamente 2 caracteres (ej: '01')."}
    )

    # Capacidad máxima de personas
    maxper = fields.Int(required=False, default=2)