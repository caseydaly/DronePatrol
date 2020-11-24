from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import mysql.connector
import yaml
import numpy as np
import json
import os
import os.path
import base64
import time
import email.utils
import datetime
import random
import string

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
    
def write_image_to_disk(img_data):
    #create random string of length 8
    file_name = ''.join(random.choice(string.ascii_lowercase) for i in range(8))
    file_path = '../' + file_name
    #make sure we haven't randomly generated this file name before
    while (not os.path.isfile(file_path)):
        file_name = ''.join(random.choice(string.ascii_lowercase) for i in range(8))
        file_path = '../' + file_name
    with open(file_path, 'wb') as f:
        f.write(img_data)
    
    #return the absolute file path it was written to
    return os.path.abspath(file_path)

def store_sighting(file_path, date, latitude, longitude, shark_type, length):
    with mydb.cursor() as cursor:
        cursor.execute("""
            INSERT INTO
                Sightings (Date, Latitude, Longitude, ImagePath, Type, Length)
            VALUES
                (%(date)s, %(latitude)d, %(longitude)d, %(file_path)s, %(type)s, %(length)d)
            """, {
                'date': date,
                'latitude': latitude,
                'longitude': longitude,
                'file_path': file_path,
                'type': shark_type,
                'length': length
            })
        result = cursor.execute()
        print("result was " + str(result))


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
        if not (type(body['date']) is int):
            return "'date' field must be an integer representing a unix time stamp", 400
        

        date = datetime.datetime.fromtimestamp(body['date']).strftime('%c')
        lat = body['lat']
        lon = body['lon']
        img_encoded = body['img']
        img_decoded = base64.b64decode(img_encoded)
        print(img_encoded)
        print(date)
        print(lat)
        print(lon)
        file_path = write_image_to_disk(img_decoded)

        #need a real way to determine shark type and size, use these defaults for now
        store_sighting(file_path, date, latitude, longitude, "Great White Shark", 12)
              
    elif request.method == 'GET':
        pass

    test = "testing"
    return jsonify(test)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port="5001")
