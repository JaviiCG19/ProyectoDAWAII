from marshmallow import Schema, fields, validate

class FranjaRequest(Schema):
    idlocal = fields.Int(required=True)
    # Validamos formato HH:MM (ej: 08:30 o 22:00)
    hora_inicio = fields.Str(
        required=True,
        validate=validate.Regexp(r'^([01]\d|2[0-3]):([0-5]\d)$')
    )
    hora_fin = fields.Str(
        required=True,
        validate=validate.Regexp(r'^([01]\d|2[0-3]):([0-5]\d)$')
    )
    estado = fields.Int(required=False, default=1)