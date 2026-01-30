from marshmallow import Schema, fields, validate

class ReportePeriodoRequest(Schema):
    fecha_inicio = fields.Date(required=True)
    fecha_fin = fields.Date(required=True)

class ReporteTopClientesRequest(Schema):
    limite = fields.Integer(required=False, validate=validate.Range(min=1, max=100), missing=10)