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
from math import radians, cos, sin, asin, sqrt
import requests

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
        if not (type(body['date']) is int):
            return "'date' field must be an integer representing a unix time stamp", 400
        print(body['date'])
        print(datetime.datetime.fromtimestamp(body['date']))
        date = datetime.datetime.fromtimestamp(body['date']).strftime('%Y-%m-%d %H:%M:%S')
        lat = body['lat']
        lon = body['lon']
        img_encoded = body['img']
        img_decoded = base64.b64decode(img_encoded)
        file_path = write_image_to_disk(img_decoded)
        location = get_sighting_location(lat, lon)
        #need a real way to determine shark type, size, and distance to shore. use these defaults for now
        store_sighting(file_path, date, lat, lon, "Great White Shark", 12, 112, location)

        return "Success", 200
              
    elif request.method == 'GET':
        sighting_list = get_sightings()
        return jsonify(sighting_list), 200


@app.route('/api/samplesighting', methods=['GET'])     
def get_sample_sightings():
    cursor = mydb.cursor()
    cursor.execute("Select SightingDate, Latitude, Longitude, ImagePath, SharkType, Length, DistanceToShore, Location from SampleSightings;")
    results = cursor.fetchall()
    sighting_list = []
    for obj in results:
        sighting_list.append({
            "date": int(obj[0].timestamp()) if obj[0] is not None else obj[0],
            "lat": float(obj[1]) if obj[1] is not None else obj[1],
            "lon": float(obj[2]) if obj[2] is not None else obj[2],
            "img": get_img_from_path(obj[3]) if obj[3] is not None else obj[3],
            "type": str(obj[4]) if obj[4] is not None else obj[4],
            "size": int(obj[5]) if obj[5] is not None else obj[5],
            "dist_to_shore": int(obj[6]) if obj[6] is not None else obj[6],
            "location": str(obj[7]) if obj[7] is not None else obj[7]
        })
    mydb.commit()
    return jsonify(sighting_list), 200

@app.route('/api/signup', methods=['POST'])
def handle_sms_signup():
    body = request.json
    #check that all necessary fields were included
    if not "phone" in body:
        return "Must include the 'phone' field in request body", 400
    if not "location" in body:
        return "Must include the 'location' field in request body", 400
    if not "radius" in body:
        return "Must include the 'radius' field in request body", 400

    #check that fields are of the correct type
    if not (type(body['phone']) is str):
        return "'phone' field must be of type string", 400
    if not (type(body['location']) is str):
        return "'location' field must be of type string", 400
    if not (type(body['radius']) is int):
        return "'radius' field must be of type integer", 400

    phone = body['phone']
    location = body['location']
    radius = body['radius']

    print(phone)
    print(location)
    print(radius)

    lat, lon = get_coordinates_from_location(location)

    store_sms_signup(phone, lat, lon, radius)

    return "OK", 200


def get_coordinates_from_location(location):
    url_local = 'http://localhost:5000/api/coords?location=' + location
    lat, lon = requests.get(url_local).json()
    return lat, lon


def store_sms_signup(phone, lat, lon, radius):
    cursor = mydb.cursor()
    result = cursor.execute("""
        INSERT INTO
            Alerts (PhoneNumber, Latitude, Longitude, Radius)
        VALUES
            (%s, %s, %s, %s)
        """, (phone, lat, lon, radius))
    mydb.commit()
    
def write_image_to_disk(img_data):
    #create random string of length 8
    file_name = ''.join(random.choice(string.ascii_lowercase) for i in range(8))
    file_path = '../../images/' + file_name + ".jpg"
    #make sure we haven't randomly generated this file name before
    while (os.path.isfile(file_path)):
        file_name = ''.join(random.choice(string.ascii_lowercase) for i in range(8))
        file_path = '../../images/' + file_name + ".jpg"
    with open(file_path, 'wb') as f:
        f.write(img_data)
    
    #return the absolute file path it was written to
    return os.path.abspath(file_path)

def store_sighting(file_path, date, latitude, longitude, shark_type, length, distance_to_shore, location):
    cursor = mydb.cursor()
    result = cursor.execute("""
        INSERT INTO
            Sightings (SightingDate, Latitude, Longitude, ImagePath, SharkType, Length, DistanceToShore, Location)
        VALUES
            (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (date, latitude, longitude, file_path, shark_type, length, distance_to_shore, location))
    mydb.commit()

def get_img_from_path(path):
    with open(path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        print(encoded_string)
    return encoded_string

def get_sightings():
    cursor = mydb.cursor()
    cursor.execute("Select SightingDate, Latitude, Longitude, ImagePath, SharkType, Length, DistanceToShore, Location from Sightings;")
    results = cursor.fetchall()
    sighting_list = []
    for obj in results:
        sighting_list.append({
            "date": int(obj[0].timestamp()) if obj[0] is not None else obj[0],
            "lat": float(obj[1]) if obj[1] is not None else obj[1],
            "lon": float(obj[2]) if obj[2] is not None else obj[2],
            "img": get_img_from_path(obj[3]) if obj[3] is not None else obj[3],
            "type": str(obj[4]) if obj[4] is not None else obj[4],
            "size": int(obj[5]) if obj[5] is not None else obj[5],
            "dist_to_shore": int(obj[6]) if obj[6] is not None else obj[6],
            "location": str(obj[7]) if obj[7] is not None else obj[7]
        })
    mydb.commit()
    return sighting_list

def get_sighting_location(lat, lon):
    url_local = 'http://localhost:5000/api/closest?lat=' + str(lat) + '&lon=' + str(lon)
    spot = requests.get(url_local).json()
    print(spot['name'])
    print(spot['area'])
    print(spot['country'])
    print(str(distance(lat, lon, spot['lat'], spot['lon'])))
    #if sighting happened within 3 miles of a beach, report that it happened at that beach
    if distance(lat, lon, spot['lat'], spot['lon']) < 3:
        return spot['name']
    #if a sighting happened within 10 miles of a beach, report the area the beach is located in
    elif distance(lat, lon, spot['lat'], spot['lon']) < 10:
        return spot['area']
    #if it was farther than 10 miles from nearest beach, report the country the sighting was closest to
    else:
        return spot['country']

def distance(lat1, lon1, lat2, lon2):

    R = 3959.87433 # this is in miles

    dLat = radians(lat2 - lat1)
    dLon = radians(lon2 - lon1)
    lat1 = radians(lat1)
    lat2 = radians(lat2)

    a = sin(dLat/2)**2 + cos(lat1)*cos(lat2)*sin(dLon/2)**2
    c = 2*asin(sqrt(a))

    return R * c


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port="5001")
