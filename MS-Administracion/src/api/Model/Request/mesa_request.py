from marshmallow import Schema, fields, validate

class MesaRequest(Schema):
    # Asegura que la mesa pertenezca a un local específico
    idlocal = fields.Int(
        required=True,
        error_messages={"required": "El ID del local es obligatorio."}
    )

    numero = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=10),
        error_messages={"required": "El número de mesa es obligatorio (ej: ms-1, ms-10)."}
    )


    maxper = fields.Int(
        required=True,
        validate=validate.Range(min=1),
        error_messages={"required": "Debe especificar la capacidad de personas (mínimo 1)."}
    )

    # Estado para Borrado Lógico (1: Activo, 0: Inactivo)
    estado = fields.Int(
        required=False,
        validate=validate.OneOf([0, 1]),
        load_default=1
    )