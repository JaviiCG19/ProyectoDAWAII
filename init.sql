-- 1. Configuraciones iniciales
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

-- 2. Esquema
CREATE SCHEMA IF NOT EXISTS dawa;

-- 3. Estructura de Tablas (DDL)
CREATE TABLE dawa.roles (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre character varying(30)
);

CREATE TABLE dawa.usuarios (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre character(10) NOT NULL,
    clave character varying(255) NOT NULL,
    estado integer DEFAULT 0 NOT NULL,
    roles character varying(10),
    detalle character varying(30),
    rol_prioritario integer NOT NULL,
    respuesta character varying(150),
    id_res integer DEFAULT NULL, 
    id_local integer DEFAULT NULL
);

CREATE TABLE dawa.empresas (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nomleg character(50) NOT NULL,
    nomfan character(50) NOT NULL,
    ruc character(13) NOT NULL,
    fecact date NOT NULL,
    estado integer DEFAULT 0 NOT NULL
);

CREATE TABLE dawa.locales (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idcia integer DEFAULT 0 NOT NULL,
    detalle character(50) NOT NULL,
    direccion character(150) NOT NULL,
    totmesas integer DEFAULT 1 NOT NULL,
    fecact date NOT NULL,
    estado integer DEFAULT 1
);

CREATE TABLE dawa.clientes (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre character(60) NOT NULL,
    ruc_cc character(13) NOT NULL,
    telefono character(10) NOT NULL,
    fecing date NOT NULL
);

CREATE TABLE dawa.franjas (
    id integer NOT NULL,
    idlocal integer DEFAULT 0 NOT NULL,
    diasem integer DEFAULT 0 NOT NULL,
    horini character(5) NOT NULL,
    horfin character(5) NOT NULL,
    tipres integer DEFAULT 0 NOT NULL,
    estado integer DEFAULT 0 NOT NULL,
    fecact date NOT NULL
);

CREATE TABLE dawa.franjas_horarias (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idlocal integer DEFAULT 0 NOT NULL,
    hora_inicio character(5) NOT NULL,
    hora_fin character(5) NOT NULL,
    estado integer DEFAULT 0 NOT NULL,
    fecact date DEFAULT CURRENT_DATE NOT NULL
);

CREATE TABLE dawa.mesas (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idlocal integer DEFAULT 0 NOT NULL,
    numero character varying(10) NOT NULL,
    maxper integer DEFAULT 2 NOT NULL,
    estado integer DEFAULT 0 NOT NULL,
    fecact date NOT NULL
);

CREATE TABLE dawa.reservas (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idlocal integer DEFAULT 0 NOT NULL,
    idmesa integer DEFAULT 0 NOT NULL,
    idcliente integer DEFAULT 0 NOT NULL,
    fecha date NOT NULL,
    numper integer DEFAULT 1 NOT NULL,
    estado integer DEFAULT 0 NOT NULL,
    fecact date NOT NULL,
    franja_id integer DEFAULT 0 NOT NULL,
    CONSTRAINT fk_reserva_franja FOREIGN KEY (franja_id) REFERENCES dawa.franjas_horarias(id),
    CONSTRAINT fk_reserva_local FOREIGN KEY (idlocal) REFERENCES dawa.locales(id),
    CONSTRAINT fk_reserva_mesa FOREIGN KEY (idmesa) REFERENCES dawa.mesas(id),
    CONSTRAINT fk_reserva_cliente FOREIGN KEY (idcliente) REFERENCES dawa.clientes(id)
);

CREATE TABLE dawa.anticipos (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idreserva integer DEFAULT 0 NOT NULL UNIQUE,
    monto numeric(10,2) NOT NULL,
    fecha date NOT NULL,
    estado integer DEFAULT 0 NOT NULL,
    fecact date NOT NULL,
    CONSTRAINT fk_anticipo_reserva FOREIGN KEY (idreserva) REFERENCES dawa.reservas(id) ON DELETE CASCADE
);

CREATE INDEX idx_reservas_fecha_mesa ON dawa.reservas(fecha, idmesa);
CREATE INDEX idx_reservas_estado ON dawa.reservas(estado);
CREATE INDEX idx_reservas_franja ON dawa.reservas(franja_id);
CREATE INDEX idx_anticipos_idreserva ON dawa.anticipos(idreserva);
CREATE INDEX idx_franjas_local ON dawa.franjas_horarias(idlocal);
CREATE INDEX idx_mesas_local ON dawa.mesas(idlocal);

CREATE TABLE dawa.promociones (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idlocal integer DEFAULT 0 NOT NULL,
    nombre character(50) NOT NULL,
    descripcion character(150),
    descuento numeric(5,2) NOT NULL,
    fec_inicio date NOT NULL,
    fec_fin date NOT NULL,
    estado integer DEFAULT 1 NOT NULL,
    fecact date DEFAULT CURRENT_DATE NOT NULL
);
-- FUNCIONES Y TRIGGERS

-- Función: Crear franjas automáticamente cuando se crea un local
CREATE OR REPLACE FUNCTION dawa.crear_franjas_desde_horario()
RETURNS TRIGGER AS $$
DECLARE
    v_inicio TIME;
    v_fin TIME;
    v_total_minutos INTEGER;
    v_duracion INTEGER;
    v_actual TIME;
    v_siguiente TIME;
    i INTEGER;
BEGIN
    v_inicio := NEW.horini::TIME;
    v_fin := NEW.horfin::TIME;

    IF v_fin <= v_inicio THEN
        RAISE EXCEPTION 'Hora fin (%) debe ser mayor que hora inicio (%)',
            v_fin, v_inicio;
    END IF;

    DELETE FROM dawa.franjas_horarias
    WHERE idlocal = NEW.idlocal;

    v_total_minutos :=
        EXTRACT(EPOCH FROM (v_fin - v_inicio)) / 60;

    v_duracion := v_total_minutos / 5;
    v_actual := v_inicio;

    FOR i IN 1..5 LOOP
        v_siguiente := v_actual + (v_duracion || ' minutes')::INTERVAL;

        INSERT INTO dawa.franjas_horarias (
            idlocal, hora_inicio, hora_fin, estado, fecact
        ) VALUES (
            NEW.idlocal,
            to_char(v_actual, 'HH24:MI'),
            to_char(v_siguiente, 'HH24:MI'),
            0,
            CURRENT_DATE
        );

        v_actual := v_siguiente;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_crear_franjas_horarias
AFTER INSERT ON dawa.franjas
FOR EACH ROW
EXECUTE FUNCTION dawa.crear_franjas_desde_horario();

-- 4. Inserci n de Datos (DML)
-- NOTA: Se usan los IDs expl citos de tus archivos para mantener coherencia

-- Roles
INSERT INTO dawa.roles (nombre) VALUES 
('administrador'), ('gerente'), ('administrador-sucursal'), ('recepcion'), ('mesero');

-- Empresas
INSERT INTO dawa.empresas (nomleg, nomfan, ruc, fecact, estado) VALUES
('Comelon SAS', 'El comelon', '0909090909001', '2026-01-22', 1),
('Favorita', 'Baraton', '0999556366689', '2026-02-04', 1);

-- Franjas
INSERT INTO dawa.franjas (id, idlocal, diasem, horini, horfin, tipres, estado, fecact) VALUES
(1, 1, 1, '08:00', '23:00', 0, 1, '2026-02-04'),
(2, 2, 1, '08:00', '23:00', 0, 1, '2026-02-04'),
(3, 3, 1, '08:00', '23:00', 0, 1, '2026-02-04');

-- Locales
INSERT INTO dawa.locales (idcia, detalle, direccion, totmesas, fecact, estado) VALUES 
(1, 'Restaurante Centro', 'Av. 9 de Octubre #123', 10, '2026-02-04', 1),
(1, 'Restaurante Norte', 'Av. Francisco de Orellana #456', 8, '2026-02-04', 1),
(1, 'Restaurante Sur', 'Av. 25 de Julio #789', 6, '2026-02-04', 1);


-- Usuarios
INSERT INTO dawa.usuarios (nombre, clave, estado, roles, detalle, rol_prioritario, id_res, id_local) VALUES
('admin', 'scrypt:32768:8:1$ytUcOf98BZJyheyS$fa77b3f5d788dcdbc0fee44473a080343c186aea33e50aea02718d08b5e99bb507779c581ad2e30f1897a521187497286e3967d6b6c89c16faed9d23aa8472db', 0, '1;2;3;', 'Administrador del sistema', 1, NULL,NULL),
('gerente', 'scrypt:32768:8:1$ytUcOf98BZJyheyS$fa77b3f5d788dcdbc0fee44473a080343c186aea33e50aea02718d08b5e99bb507779c581ad2e30f1897a521187497286e3967d6b6c89c16faed9d23aa8472db', 0, '1;3;4;', 'Gerencia General', 2, 1,NULL);

-- Clientes
INSERT INTO dawa.clientes (nombre, ruc_cc, telefono, fecing) VALUES
('Galo Izquierdo', '0000000000', '0909094654', '2026-01-22'),
('Alexis Valarezo', '0987654321222', '0999888111', '2026-01-30'),
('Juan Carlos Perez', '0899999999', '0988777666', '2026-01-26');



-- Mesas para Local 1 (10 mesas)
INSERT INTO dawa.mesas (idlocal, numero, maxper, estado, fecact) VALUES
(1, 'Mesa 01', 4, 0, '2026-02-04'),
(1, 'Mesa 02', 4, 0, '2026-02-04'),
(1, 'Mesa 03', 6, 0, '2026-02-04'),
(1, 'Mesa 04', 2, 0, '2026-02-04'),
(1, 'Mesa 05', 4, 0, '2026-02-04'),
(1, 'Mesa 06', 8, 0, '2026-02-04'),
(1, 'Mesa 07', 2, 0, '2026-02-04'),
(1, 'Mesa 08', 4, 0, '2026-02-04'),
(1, 'Mesa 09', 6, 0, '2026-02-04'),
(1, 'Mesa 10', 4, 0, '2026-02-04');

-- Mesas para Local 2 (8 mesas)
INSERT INTO dawa.mesas (idlocal, numero, maxper, estado, fecact) VALUES
(2, 'Mesa 01', 4, 0, '2026-02-04'),
(2, 'Mesa 02', 4, 0, '2026-02-04'),
(2, 'Mesa 03', 6, 0, '2026-02-04'),
(2, 'Mesa 04', 2, 0, '2026-02-04'),
(2, 'Mesa 05', 4, 0, '2026-02-04'),
(2, 'Mesa 06', 8, 0, '2026-02-04'),
(2, 'Mesa 07', 2, 0, '2026-02-04'),
(2, 'Mesa 08', 4, 0, '2026-02-04');

-- Mesas para Local 3 (6 mesas)
INSERT INTO dawa.mesas (idlocal, numero, maxper, estado, fecact) VALUES
(3, 'Mesa 01', 4, 0, '2026-02-04'),
(3, 'Mesa 02', 4, 0, '2026-02-04'),
(3, 'Mesa 03', 6, 0, '2026-02-04'),
(3, 'Mesa 04', 2, 0, '2026-02-04'),
(3, 'Mesa 05', 4, 0, '2026-02-04'),
(3, 'Mesa 06', 8, 0, '2026-02-04');


-- Permisos finales para tu usuario de aplicaci n
ALTER SCHEMA dawa OWNER TO user_dawa;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA dawa TO user_dawa;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA dawa TO user_dawa;