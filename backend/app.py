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
import OpenSSL
from DBConnection import DBConnection

with DBConnection() as mydb:
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
        try:
            lat = float(body['lat'])
        except:
            return "'lat' field must be of type float", 400

        try:
            lon = float(body['lon'])
        except:
            return "'lon' field must be of type float", 400

        try:
            img_encoded = str(body['img'])
            img_decoded = base64.b64decode(img_encoded)
        except:
            return "'img' field must be a base64 encoded string", 400

        try:
            temp_date = int(body['date'])
        except:
            return "'date' field must be an integer representing a unix time stamp", 400

        try:
            date = datetime.datetime.fromtimestamp(temp_date).strftime('%Y-%m-%d %H:%M:%S')
        except OverflowError:
            return "'date' field specified is too large", 400
        file_path = write_image_to_disk(img_decoded)
        location = get_sighting_location(lat, lon)
        #need a real way to determine shark type, size, and distance to shore. use these defaults for now
        store_sighting(file_path, date, lat, lon, "Great White Shark", 12, 112, location)

        return "Success", 200
              
    elif request.method == 'GET':
        body = request.json
        #set start and end as min and max (respectively) unix time stamp values in case user didn't supply one of or both values
        start = 0
        end = 2147483647
        tempStart = None
        tempEnd = None
        if body: #user supplied a body to the request
            if "start" in body:
                tempStart = body['start']
            if "end" in body:
                tempEnd = body['end']
        elif request.args.get("start") or request.args.get("end"): #user used url args
            if request.args.get("start") != None:
                tempStart = request.args.get("start").strip()
            if request.args.get("end") != None:
                tempEnd = request.args.get("end").strip()
        try:
            start = int(tempStart) if tempStart else start
            end = int(tempEnd) if tempEnd else end
        except:
            return "'start' and 'end' fields must be integers representing unix time stamps", 400
        sighting_list = get_sightings(datetime.datetime.fromtimestamp(start).replace(hour=0, minute=0, second=0), datetime.datetime.fromtimestamp(end).replace(hour=23, minute=59, second=59))
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
    if not (type(body['phone']) is str or type(body['phone']) is int):
        return "'phone' field must be of type string or integer", 400
    if not (type(body['location']) is str):
        return "'location' field must be of type string", 400
    if not (type(body['radius']) is int):
        return "'radius' field must be of type integer", 400


    phone = str(body['phone'])
    if len(phone) != 10:
        return "length of 'phone' field in request must be 10", 400
    if not phone.isdigit():
        return "'phone' field must be an integer or string containing only numbers", 400
    
    location = body['location']

    radius = body['radius']
    if radius < 0:
        return "'radius' field must be greater than 0", 400

    lat, lon = get_coordinates_from_location(location)
    if lat == None or lon == None:
        return "Error retrieving coordinates from chosen location", 400

    store_sms_signup(phone, lat, lon, radius)

    return "OK", 200


def get_coordinates_from_location(location):
    print(location)
    try:
        #debug_url = 'http://0.0.0.0:5000/api/coords?location=' + location
        url = 'https://surfspotsapi.com/api/coords?location=' + location
        response = requests.get(url)
        lat, lon = response.json()
        return lat, lon
    except:
        return None, None


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
    return encoded_string

def get_sightings(start, end):
    cursor = mydb.cursor()
    cursor.execute("""
        SELECT 
            SightingDate, Latitude, Longitude, ImagePath, SharkType, Length, DistanceToShore, Location
        FROM
            Sightings
        WHERE
            SightingDate >= %s and SightingDate <= %s;
        """, (start,end))
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
    try:
        url_local = 'https://localhost:5000/api/closest?lat=' + str(lat) + '&lon=' + str(lon)
        spot = requests.get(url_local).json()
        #if sighting happened within 3 miles of a beach, report that it happened at that beach
        if distance(lat, lon, spot['lat'], spot['lon']) < 3:
            return spot['name']
        #if a sighting happened within 10 miles of a beach, report the area the beach is located in
        elif distance(lat, lon, spot['lat'], spot['lon']) < 10:
            return spot['area']
        #if it was farther than 10 miles from nearest beach, report the country the sighting was closest to
        else:
            return spot['country']
    except:
        return None

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
