from marshmallow import Schema, fields, validate

class AnticipoCreateRequest(Schema):
    idreserva = fields.Integer(required=True)
    monto = fields.Decimal(required=True, places=2, validate=validate.Range(min=0))