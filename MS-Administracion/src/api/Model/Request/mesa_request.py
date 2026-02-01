from marshmallow import Schema, fields, validate

class MesaRequest(Schema):
    # Asegura que la mesa pertenezca a un local específico
    idlocal = fields.Int(
        required=True,
        error_messages={"required": "El ID del local es obligatorio."}
    )


    numero = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=10),
        error_messages={
            "required": "El número de mesa es obligatorio.",
            "validator_failed": "El formato debe ser tipo 'ms-1' (máx 10 caracteres)."
        }
    )

    # Capacidad de personas: Siempre debe ser al menos 1
    maxper = fields.Int(
        required=True,
        validate=validate.Range(min=1),
        error_messages={
            "required": "Debe especificar la capacidad de personas.",
            "validator_failed": "La capacidad mínima es de 1 persona."
        }
    )

    # Estado para Borrado Lógico (1: Activo, 0: Inactivo)
    estado = fields.Int(
        required=False,
        validate=validate.OneOf([0, 1]),
        load_default=1
    )