from marshmallow import Schema, fields, validate


class EmpresaRequest(Schema):
    # Nombre Legal (Razón Social) - máx 50 según tu SQL
    nomleg = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=50),
        error_messages={"required": "El nombre legal es obligatorio."}
    )

    # Nombre Fantasía (Nombre comercial) - máx 50
    nomfan = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=50),
        error_messages={"required": "El nombre comercial es obligatorio."}
    )

    # RUC - exactamente 13 caracteres en Ecuador y en tu SQL
    ruc = fields.Str(
        required=True,
        validate=validate.Length(equal=13),
        error_messages={"required": "El RUC es obligatorio y debe tener 13 dígitos."}
    )