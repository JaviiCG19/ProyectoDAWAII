from marshmallow import Schema, fields, validate

class ReservaCreateRequest(Schema):
    idlocal = fields.Integer(required=True)
    idmesa = fields.Integer(required=True)
    idcliente = fields.Integer(required=True)
    fecha = fields.Date(required=True)
    franja_id = fields.Integer(required=True)
    numper = fields.Integer(required=False, validate=validate.Range(min=1), missing=1)