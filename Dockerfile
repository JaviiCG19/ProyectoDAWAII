# Usar la imagen base de Python
FROM python:3.9-slim
# Instalar dependencias del sistema y configurar Zona Horaria
# Añadimos libpq-dev para que Python pueda comunicarse con PostgreSQL
RUN apt-get update &&  \
    apt-get -y install --no-install-recommends \
    tzdata \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*


# Configurar zona horaria de Ecuador para que no se detenga el build
ENV TZ=America/Guayaquil
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Directorio de trabajo
# Usamos una estructura clara dentro del contenedor
WORKDIR /app
# Instalación de dependencias de Python
# Copiamos el archivo de requerimientos primero para aprovechar el cache de Docker
COPY src/utils/requerimientos.txt ./requerimientos.txt
RUN pip3 --no-cache-dir install -r ./requerimientos.txt

# Copiar el código fuente
# Copiamos todo el contenido de ms-security a la carpeta /app
COPY . /app

# Exponer el puerto (asumiendo que app.py corre en el 10100)
EXPOSE 10100

# Ejecución
CMD ["python3", "app.py"]