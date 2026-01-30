# Imagen base de Python
FROM python:3.9-slim

# Instalar dependencias del sistema
RUN apt-get update && \
    apt-get -y install --no-install-recommends \
    tzdata && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Configurar zona horaria de Ecuador
ENV TZ=America/Guayaquil
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Establecer directorio de trabajo
WORKDIR /app/reservas

# Copiar archivos al contenedor
COPY . /app/reservas

# Instalar dependencias de Python
RUN pip3 --no-cache-dir install -r requirements.txt

# Exponer puerto
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["python3", "app.py"]