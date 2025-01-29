from flask import Flask, jsonify, request
import configparser
import os
import requests
import psycopg2
import redis
import pika
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

config = configparser.ConfigParser()
config.read('config.ini')

@app.route("/")
def index():
    return f"Welcome to the Flask {config['DEFAULT'].get('APP_NAME')}";

@app.route("/env", methods=["GET"])
def get_env():
    return jsonify(dict(os.environ))

@app.route("/connect", methods=["POST"])
def connect():
    data = request.get_json()
    host = data.get('host')
    port = data.get('port')
    try:
        response = requests.get(f"http://{host}:{port}/env")
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    health_status = {
        "postgres": "Fail",
        "rabbitmq": "Fail",
        "redis": "Fail"
    }

    # Check PostgreSQL connection
    try:
        conn = psycopg2.connect(
            dbname=config['DEFAULT'].get('POSTGRES_DB'),
            user=config['DEFAULT'].get('POSTGRES_USER'),
            password=config['DEFAULT'].get('POSTGRES_PASSWORD'),
            host=config['DEFAULT'].get('POSTGRES_HOST'),
            port=config['DEFAULT'].get('POSTGRES_PORT')
        )
        conn.close()
        health_status["postgres"] = "OK"
    except Exception as e:
        print(f"PostgreSQL connection error: {e}")

    # Check RabbitMQ connection
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=config['DEFAULT'].get('RABBITMQ_HOST'),
                port=config['DEFAULT'].get('RABBITMQ_PORT'),
                credentials=pika.PlainCredentials(
                    username=config['DEFAULT'].get('RABBITMQ_USER'), 
                    password=config['DEFAULT'].get('RABBITMQ_PASSWORD')
                )
            )
        )
        connection.close()
        health_status["rabbitmq"] = "OK"
    except Exception as e:
        print(f"RabbitMQ connection error: {e}")

    # Check Redis connection
    try:
        r = redis.Redis(
            host=config['DEFAULT'].get('REDIS_HOST'),
            port=config['DEFAULT'].get('REDIS_PORT'),
            db=config['DEFAULT'].get('REDIS_DB'),
            # password=config['DEFAULT'].get('REDIS_PASSWORD')
        )
        r.ping()
        health_status["redis"] = "OK"
    except Exception as e:
        print(f"Redis connection error: {e}")

    return jsonify(health_status)

if __name__ == "__main__":
    app.run(debug=True, host=config['DEFAULT'].get('APP_HOST'), port=config['DEFAULT'].get('APP_PORT'))
