# docker build -t dawa_ws_image:latest .
FROM python:3.9-slim
RUN apt-get update &&  \
    apt-get -y install --no-install-recommends \
    tzdata


# Configurar zona horaria de Ecuador para que no se detenga el build
ENV TZ=America/Guayaquil
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app/dawa
COPY . /app/dawa
RUN pip3 --no-cache-dir install -r src/utils/requerimientos.txt
CMD ["python3", "app.py"]