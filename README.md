# ProyectoDAWAII
Proyecto del Segundo Parcial de DAWA.

proyecto/
+-- ms-security/        # Auth, JWT, Usuarios
¦   +-- Dockerfile
¦   +-- main.py
+-- ms-administracion/  # Gestión interna
¦   +-- Dockerfile
¦   +-- main.py
+-- ms-reservas/        # Lógica de reservas
¦   +-- Dockerfile
¦   +-- main.py
+-- frontend/           # Next.js
+-- nginx/
¦   +-- default.conf    # <-- Aquí ocurrirá la magia del enrutamiento
+-- database/
¦   +-- create_dbs.sql  # Script para crear 3 bases de datos
+-- docker-compose.yml
