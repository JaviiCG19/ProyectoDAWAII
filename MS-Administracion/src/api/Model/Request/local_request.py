from marshmallow import Schema, fields, validate

class LocalRequest(Schema):
    # Relación con la Empresa (idcia)
    idcia = fields.Int(
        required=True,
        error_messages={"required": "El ID de compañía es obligatorio."}
    )

    # Nombre de la sucursal
    detalle = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=50),
        error_messages={
            "required": "El nombre del local es obligatorio.",
            "validator_failed": "El detalle no puede exceder los 50 caracteres."
        }
    )

    # Dirección física
    direccion = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=150),
        error_messages={
            "required": "La dirección es obligatoria.",
            "validator_failed": "La dirección no puede exceder los 150 caracteres."
        }
    )

    # Cantidad de mesas: Esencial para el bucle automático del Service
    totmesas = fields.Int(
        required=False,
        load_default=1,
        error_messages={"invalid": "El total de mesas debe ser un número entero."}
    )