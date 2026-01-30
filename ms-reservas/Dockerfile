FROM python:3.9-slim

RUN apt-get update && \
    apt-get -y install --no-install-recommends \
    tzdata && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV TZ=America/Guayaquil
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app/reservas

COPY . /app/reservas

RUN pip3 --no-cache-dir install -r requirements.txt

EXPOSE 5000

CMD ["python3", "app.py"]