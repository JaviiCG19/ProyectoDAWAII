from marshmallow import Schema, fields, validate

class ReportePeriodoRequest(Schema):
    idlocal = fields.Integer(required=True) # Agregado
    fecha_inicio = fields.Date(required=True)
    fecha_fin = fields.Date(required=True)

class ReporteTopClientesRequest(Schema):
    idlocal = fields.Integer(required=True) # Ya lo habíamos agregado
    limite = fields.Integer(required=False, validate=validate.Range(min=1, max=100), missing=10)