from marshmallow import Schema, fields, validate, validates_schema, ValidationError

class PromocionRequest(Schema):
    # ID opcional para actualizaciones (PUT)
    id = fields.Int(required=False)

    # Relación obligatoria con el local
    idlocal = fields.Int(
        required=True,
        error_messages={"required": "El ID del local es obligatorio."}
    )

    # Nombre: min 3 caracteres
    nombre = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=50),
        error_messages={
            "required": "El nombre de la promoción es obligatorio.",
            "validator_failed": "El nombre debe tener entre 3 y 50 caracteres."
        }
    )

    descripcion = fields.Str(
        validate=validate.Length(max=150),
        error_messages={"validator_failed": "La descripción no puede exceder los 150 caracteres."}
    )

    # Descuento: numeric(5,2)
    descuento = fields.Float(
        required=True,
        validate=validate.Range(min=0.01, max=100.0),
        error_messages={
            "required": "El porcentaje de descuento es obligatorio.",
            "validator_failed": "El descuento debe ser un valor entre 0.01 y 100."
        }
    )

    # Fechas
    fec_inicio = fields.Date(
        required=True,
        error_messages={"required": "La fecha de inicio es requerida."}
    )
    fec_fin = fields.Date(
        required=True,
        error_messages={"required": "La fecha de fin es requerida."}
    )

    # Estado (1: Activa, 0: Papelera)
    estado = fields.Int(
        required=False,
        validate=validate.OneOf([0, 1]),
        load_default=1
    )

    @validates_schema
    def validar_fechas(self, data, **kwargs):
        if 'fec_inicio' in data and 'fec_fin' in data:
            if data['fec_inicio'] > data['fec_fin']:
                raise ValidationError(
                    "La fecha de finalización no puede ser anterior a la de inicio.",
                    field_name="fec_fin"
                )