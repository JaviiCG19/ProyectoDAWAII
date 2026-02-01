from marshmallow import Schema, fields, validate

class EmpresaRequest(Schema):
    # El nombre legal es vital para facturación y reportes.
    nomleg = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=50),
        error_messages={"required": "El nombre legal es obligatorio."}
    )

    # Nombre comercial para mostrar en el Dashboard del Gerente.
    nomfan = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=50),
        error_messages={"required": "El nombre comercial es obligatorio."}
    )

    # El RUC es la clave única en Ecuador. Validamos 13 caracteres exactos
    # para evitar datos huérfanos o inválidos.
    ruc = fields.Str(
        required=True,
        validate=validate.Length(equal=13),
        error_messages={"required": "El RUC es obligatorio y debe tener 13 dígitos."}
    )