FROM python:3.9-slim

RUN apt-get update &&  \
    apt-get -y install --no-install-recommends \
    tzdata \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

ENV TZ=America/Guayaquil
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
COPY . /app

# Usamos tu ruta de requerimientos confirmada
RUN pip3 --no-cache-dir install -r src/utils/requerimientos.txt

# Ponemos el puerto que realmente usa tu app.py
EXPOSE 10103

CMD ["python3", "app.py"]
