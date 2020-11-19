from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import mysql.connector
import yaml
import numpy as np
import json
import os

with open('db_info.yaml') as file:
    db_info = yaml.load(file, Loader=yaml.FullLoader)
    mydb = mysql.connector.connect(
        host=db_info['host'],
        user=db_info['user'],
        password=db_info['password'],
        database=db_info['database']
    )

app = Flask(__name__, static_folder='../src/build')
CORS(app)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/sighting', methods=['GET', 'POST'])
def get_spots():
    if request.method == 'POST':
        body = request.json
        if not "date" in body:
            return "Must include the 'date' field in request body", 400
        if not "lat" in body:
            return "Must include the 'lat' field in request body", 400
        if not "lon" in body:
            return "Must include the 'lon' field in request body", 400
        if not "img" in body:
            return "Must include the 'img' field in request body", 400
        print(body['date'])
        print(type(body['date']))
        print(body['lat'])
        print(type(body['lat']))
        print(body['lon'])
        print(type(body['lon']))
        print(body['img'])
        print(type(body['img']))
    elif request.method == 'GET':
        pass

    test = "testing"
    return jsonify(test)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
