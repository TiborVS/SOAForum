FROM python:3.12-alpine

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY main.py .

ENV PORT=3003
EXPOSE 3003

CMD fastapi run main.py --port $PORT
