from marshmallow import Schema, fields, validate

class MesaRequest(Schema):
    # Con idlocal obligatorio, aseguramos el aislamiento .
    # Ninguna mesa puede existir sin ser dueña de un local.
    idlocal = fields.Int(
        required=True,
        error_messages={"required": "El ID del local es obligatorio para el aislamiento de datos."}
    )

    # Aquí definimos el número físico. Validamos que sean 2 caracteres
    # para que coincida exactamente con el tipo de dato SQL character(2).
    numero = fields.Str(
        required=True,
        validate=validate.Length(equal=2),
        error_messages={"required": "El número de mesa debe tener 2 dígitos (ej: 01, 05, 12)."}
    )

    # Definimos la capacidad de aforo por mesa individual.
    maxper = fields.Int(
        required=True,
        validate=validate.Range(min=1),
        error_messages={"required": "Debe especificar la capacidad de personas."}
    )