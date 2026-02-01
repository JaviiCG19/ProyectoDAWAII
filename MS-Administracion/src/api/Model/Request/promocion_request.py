from marshmallow import Schema, fields, validate, validates_schema, ValidationError

class PromocionRequest(Schema):
    idlocal = fields.Int(
        required=True,
        error_messages={"required": "El ID del local es obligatorio."}
    )

    nombre = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=50),
        error_messages={"required": "El nombre de la promoción es obligatorio."}
    )

    descripcion = fields.Str(validate=validate.Length(max=150))

    # Validamos que el descuento sea un porcentaje lógico.
    descuento = fields.Float(
        required=True,
        validate=validate.Range(min=0.01, max=100),
        error_messages={"required": "El descuento debe ser un valor entre 0.01 y 100."}
    )


    fec_inicio = fields.Date(required=True, error_messages={"required": "La fecha de inicio es requerida."})
    fec_fin = fields.Date(required=True, error_messages={"required": "La fecha de fin es requerida."})

    estado = fields.Int(
        required=False,
        validate=validate.OneOf([0, 1]),
        load_default=1
    )

    @validates_schema
    def validar_fechas(self, data, **kwargs):
        """
        CORRECCIÓN DE LÓGICA:
        Asegura que la fecha de fin no sea anterior a la de inicio.
        """
        if data['fec_inicio'] > data['fec_fin']:
            raise ValidationError(
                "La fecha de finalización no puede ser anterior a la fecha de inicio.",
                "fec_fin"
            )