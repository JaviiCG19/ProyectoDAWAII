from marshmallow import Schema, fields, validate

class ClienteCreateRequest(Schema):
    idlocal = fields.Integer(required=True) # Nuevo campo obligatorio
    nombre = fields.String(required=True, validate=validate.Length(max=60))
    ruc_cc = fields.String(required=True, validate=validate.Length(max=13))
    telefono = fields.String(required=True, validate=validate.Length(max=10))

class ClienteUpdateRequest(Schema):
    idlocal = fields.Integer(required=False) # Opcional en update
    nombre = fields.String(required=False, validate=validate.Length(max=60))
    ruc_cc = fields.String(required=False, validate=validate.Length(max=13))
    telefono = fields.String(required=False, validate=validate.Length(max=10))