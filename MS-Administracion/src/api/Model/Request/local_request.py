from marshmallow import Schema, fields, validate

class LocalRequest(Schema):
    # El ID de la compañía vincula la sucursal al dueño (Gerente)
    idcia = fields.Int(
        required=True,
        error_messages={"required": "El ID de compañía es obligatorio."}
    )

    # El detalle es el nombre de la sucursal
    detalle = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=50),
        error_messages={"required": "El nombre del local es obligatorio."}
    )

    # La dirección física del establecimiento
    direccion = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=150),
        error_messages={"required": "La dirección es obligatoria."}
    )

    # CORRECCION: Ahora es requerido y validamos que sea al menos 1 mesa.
    # Este campo activa el bucle en LocalService para crear desde ms-1 hasta ms-40.
    totmesas = fields.Int(
        required=True,
        validate=validate.Range(min=1, error="El local debe tener al menos 1 mesa."),
        error_messages={"required": "El total de mesas es obligatorio para la gestión de aforo."}
    )

    # Campo para manejo de Borrado Lógico (1: Activo, 0: Inactivo/Papelera).
    # Usamos load_default para que el Service siempre reciba un estado inicial.
    estado = fields.Int(
        required=False,
        validate=validate.OneOf([0, 1]),
        load_default=1
    )