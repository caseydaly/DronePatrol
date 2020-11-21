from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import mysql.connector
import yaml
import numpy as np
import json
import os
import base64

dir_path = os.path.dirname(os.path.realpath(__file__))
if '/Users/caseydaly' in dir_path:
    db_info_path = 'db_info.yaml'
else:
    db_info_path = '/var/www/html/DronePatrol/backend/db_info.yaml'

with open(db_info_path) as file:
    db_info = yaml.load(file, Loader=yaml.FullLoader)
    mydb = mysql.connector.connect(
        host=db_info['host'],
        user=db_info['user'],
        password=db_info['password'],
        database=db_info['database']
    )

app = Flask(__name__, static_folder='../build')
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

        #check that all necessary fields were included
        if not "date" in body:
            return "Must include the 'date' field in request body", 400
        if not "lat" in body:
            return "Must include the 'lat' field in request body", 400
        if not "lon" in body:
            return "Must include the 'lon' field in request body", 400
        if not "img" in body:
            return "Must include the 'img' field in request body", 400

        #check that fields are of the correct type
        if not (type(body['lat']) is float):
            return "'lat' field must be of type float", 400
        if not (type(body['lon']) is float):
            return "'lon' field must be of type float", 400
        if not (type(body['img']) is str):
            return "'img' field must be a base64 encoded string", 400  
        #stil not sure what type we should expect date to be, str?  

        date = body['date']
        lat = body['lat']
        lon = body['lon']
        image = body['img']

        print(date)
        print(lat)
        print(lon)
        print(image)
        imgdata = base64.b64decode(image)
        filename = '/Users/caseydaly/Desktop/some_image.jpg'  # I assume you have a way of picking unique filenames
        with open(filename, 'wb') as f:
            f.write(imgdata)
        
        
    elif request.method == 'GET':
        pass

    test = "testing"
    return jsonify(test)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
