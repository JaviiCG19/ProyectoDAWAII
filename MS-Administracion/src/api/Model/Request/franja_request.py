from marshmallow import Schema, fields, validate

class FranjaRequest(Schema):
    # Obligatorio para asegurar que el horario
    # pertenezca estrictamente a una sucursal .
    idlocal = fields.Int(
        required=True,
        error_messages={"required": "El ID del local es obligatorio para configurar el horario."}
    )

    # Validamos formato HH:MM (ej: 08:30 o 22:00) mediante Regex.
    # Esto evita errores de inserción en campos de tiempo de la DB.

    horini = fields.Str(
        required=True,
        validate=validate.Regexp(r'^([01]\d|2[0-3]):([0-5]\d)$'),
        error_messages={"required": "La hora de inicio es obligatoria (formato HH:MM)."}
    )


    horfin = fields.Str(
        required=True,
        validate=validate.Regexp(r'^([01]\d|2[0-3]):([0-5]\d)$'),
        error_messages={"required": "La hora de fin es obligatoria (formato HH:MM)."}
    )


    diasem = fields.Int(
        required=True,
        validate=validate.Range(min=0, max=6),
        error_messages={"required": "El día de la semana es obligatorio (0-6)."}
    )

    # Estado de la franja horaria : 1 para Activa, 0 para Inactiva.
    estado = fields.Int(required=False, load_default=1)