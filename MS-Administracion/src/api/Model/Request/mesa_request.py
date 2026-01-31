from marshmallow import Schema, fields, validate

class MesaRequest(Schema):
    # Clave para el multitenant: vincula la mesa a la sucursal exacta
    idlocal = fields.Int(
        required=True,
        error_messages={"required": "El ID del local es obligatorio para el aislamiento de datos."}
    )

    # Coincide con character(2) de tu SQL
    numero = fields.Str(
        required=True,
        validate=validate.Length(equal=2),
        error_messages={"required": "El número de mesa debe tener 2 dígitos (ej: 01, 05, 12)."}
    )

    # Capacidad de personas
    maxper = fields.Int(
        required=True,
        validate=validate.Range(min=1),
        error_messages={"required": "Debe especificar la capacidad de personas."}
    )