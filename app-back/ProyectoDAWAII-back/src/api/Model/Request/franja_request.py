from marshmallow import Schema, fields, validate, validates_schema, ValidationError

class FranjaRequest(Schema):
    # ID opcional para actualizaciones (PUT)
    id = fields.Int(required=False)

    # Relación con la sucursal
    idlocal = fields.Int(
        required=True,
        error_messages={"required": "El ID del local es obligatorio."}
    )

    # Validamos formato HH:MM (00:00 a 23:59)
    horini = fields.Str(
        required=True,
        validate=validate.Regexp(r'^([01]\d|2[0-3]):([0-5]\d)$'),
        error_messages={
            "required": "La hora de inicio es obligatoria.",
            "validator_failed": "Formato de hora de inicio inválido (HH:MM)."
        }
    )

    horfin = fields.Str(
        required=True,
        validate=validate.Regexp(r'^([01]\d|2[0-3]):([0-5]\d)$'),
        error_messages={
            "required": "La hora de fin es obligatoria.",
            "validator_failed": "Formato de hora de fin inválido (HH:MM)."
        }
    )

    # 0: Domingo, 1: Lunes ... 6: Sábado
    diasem = fields.Int(
        required=True,
        validate=validate.Range(min=0, max=6),
        error_messages={
            "required": "El día de la semana es obligatorio.",
            "validator_failed": "El día debe estar entre 0 (Dom) y 6 (Sáb)."
        }
    )

    # Tipo de reserva (0 por defecto)
    tipres = fields.Int(
        required=False,
        load_default=0,
        error_messages={"validator_failed": "El tipo de reserva debe ser un número entero."}
    )

    estado = fields.Int(required=False, load_default=1)

    @validates_schema
    def validar_rango_horas(self, data, **kwargs):
        if 'horini' in data and 'horfin' in data:
            if data['horini'] >= data['horfin']:
                raise ValidationError(
                    "La hora de fin debe ser mayor a la hora de inicio.",
                    field_name="horfin"
                )