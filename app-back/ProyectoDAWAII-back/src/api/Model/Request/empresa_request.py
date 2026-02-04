from marshmallow import Schema, fields, validate

class EmpresaRequest(Schema):

    nomleg = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=50),
        error_messages={
            "required": "El nombre legal es obligatorio.",
            "validator_failed": "El nombre legal debe tener entre 3 y 50 caracteres."
        }
    )

    # Nombre Fantasía (Nombre comercial)
    nomfan = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=50),
        error_messages={
            "required": "El nombre comercial es obligatorio.",
            "validator_failed": "El nombre comercial debe tener entre 3 y 50 caracteres."
        }
    )

    # RUC - Validación estricta de 13 dígitos
    ruc = fields.Str(
        required=True,
        validate=validate.Length(equal=13),
        error_messages={
            "required": "El RUC es obligatorio.",
            "validator_failed": "El RUC debe tener exactamente 13 dígitos."
        }
    )

    # Estado: 1 por defecto al crear, permite 0 para bajas
    estado = fields.Int(
        required=False,
        validate=validate.OneOf([0, 1]),
        load_default=1
    )