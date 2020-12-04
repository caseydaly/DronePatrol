import os
import mysql.connector
import pytest
from app import app
import datetime
import yaml

dir_path = os.path.dirname(os.path.realpath(__file__))
if '/Users/caseydaly' in dir_path:
    db_info_path = '/Users/caseydaly/sharkwatch/backend/db_info.yaml'
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


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_base_path(client):
    response = client.get('/')
    assert response.status_code == 200

def compare_all_but_img(sighting1, sighting2):
    return ("date" in sighting1 and "date" in sighting2 and sighting1['date'] == sighting2['date']) \
        and ("lat" in sighting1 and "lat" in sighting2 and sighting1['lat'] == sighting2['lat']) \
        and ("lon" in sighting1 and "lon" in sighting2 and sighting1['lon'] == sighting2['lon']) \
        and ("type" in sighting1 and "type" in sighting2 and sighting1['type'] == sighting2['type']) \
        and ("size" in sighting1 and "size" in sighting2 and sighting1['size'] == sighting2['size']) \
        and ("dist_to_shore" in sighting1 and "dist_to_shore" in sighting2 and sighting1['dist_to_shore'] == sighting2['dist_to_shore']) \
        and ("location" in sighting1 and "location" in sighting2 and sighting1['location'] == sighting2['location'])

    
#insert sighting into db and test retrieving it
def test_sighting_get_url_args(client):
    try:
        cursor = mydb.cursor()
        cursor.execute("""
                    INSERT INTO 
                        Sightings (SightingDate, Latitude, Longitude, ImagePath, SharkType, Length, DistanceToShore, Location)
                    VALUES
                        ('2020-12-03 09:09:00', 37.75001907348633, -122.51163482666016, '/Users/caseydaly/images/paaiedpv.jpg', 'Great White Shark', 12, 112, 'Ocean Beach');
                """)
        mydb.commit()
        start = str(int(datetime.datetime(2020, 12, 3, 9, 8, 0).timestamp()))
        end = str(int(datetime.datetime(2020, 12, 3, 9, 10, 0).timestamp()))
        response = client.get('/api/sighting?start=' + start + '&end=' + end)
        assert response.status_code == 200
        json_result = response.json
        obj = {
            "date": int(datetime.datetime(2020, 12, 3, 9, 9, 0).timestamp()),
            "lat": 37.75001907348633,
            "lon": -122.51163482666016,
            "type": 'Great White Shark',
            "size": 12,
            "dist_to_shore": 112,
            "location": 'Ocean Beach'
        }
        found = False
        for sighting in json_result:
            if compare_all_but_img(obj, sighting):
                found = True
                break
        assert found == True
    finally:
        cursor.execute("DELETE FROM Sightings WHERE SightingDate='2020-12-03 09:09:00';")
        mydb.commit()

#insert sighting into db, and test retrieving it with only passing the 'start' parameter as a url arg
def test_sighting_get_just_start_url(client):
    try:
        cursor = mydb.cursor()
        cursor.execute("""
                    INSERT INTO 
                        Sightings (SightingDate, Latitude, Longitude, ImagePath, SharkType, Length, DistanceToShore, Location)
                    VALUES
                        ('2020-12-03 09:09:00', 37.75001907348633, -122.51163482666016, '/Users/caseydaly/images/paaiedpv.jpg', 'Great White Shark', 12, 112, 'Ocean Beach');
                """)
        mydb.commit()
        start = str(int(datetime.datetime(2020, 12, 3, 9, 8, 0).timestamp()))
        url = '/api/sighting?start=' + start
        response = client.get(url)
        assert response.status_code == 200
        json_result = response.json
        obj = {
            "date": int(datetime.datetime(2020, 12, 3, 9, 9, 0).timestamp()),
            "lat": 37.75001907348633,
            "lon": -122.51163482666016,
            "type": 'Great White Shark',
            "size": 12,
            "dist_to_shore": 112,
            "location": 'Ocean Beach'
        }
        found = False
        for sighting in json_result:
            if compare_all_but_img(obj, sighting):
                found = True
                break
        assert found
    finally:
        cursor.execute("DELETE FROM Sightings WHERE SightingDate='2020-12-03 09:09:00';")
        mydb.commit()

#insert sighting into db, and test retrieving it with only passing the 'end' parameter as a url arg
def test_sighting_get_just_end_url(client):
    try:
        cursor = mydb.cursor()
        cursor.execute("""
                    INSERT INTO 
                        Sightings (SightingDate, Latitude, Longitude, ImagePath, SharkType, Length, DistanceToShore, Location)
                    VALUES
                        ('2020-12-03 09:09:00', 37.75001907348633, -122.51163482666016, '/Users/caseydaly/images/paaiedpv.jpg', 'Great White Shark', 12, 112, 'Ocean Beach');
                """)
        mydb.commit()
        end = str(int(datetime.datetime(2020, 12, 3, 9, 10, 0).timestamp()))
        response = client.get('/api/sighting?end=' + end)
        assert response.status_code == 200
        json_result = response.json
        obj = {
            "date": int(datetime.datetime(2020, 12, 3, 9, 9, 0).timestamp()),
            "lat": 37.75001907348633,
            "lon": -122.51163482666016,
            "type": 'Great White Shark',
            "size": 12,
            "dist_to_shore": 112,
            "location": 'Ocean Beach'
        }
        found = False
        for sighting in json_result:
            if compare_all_but_img(obj, sighting):
                found = True
                break
        assert found
    finally:
        cursor.execute("DELETE FROM Sightings WHERE SightingDate='2020-12-03 09:09:00';")
        mydb.commit()

#test inserting a sighting into the db directly and retrieving it via sighting method with a json request body
def test_sighting_get_json_body(client):
    try:
        cursor = mydb.cursor()
        cursor.execute("""
                    INSERT INTO 
                        Sightings (SightingDate, Latitude, Longitude, ImagePath, SharkType, Length, DistanceToShore, Location)
                    VALUES
                        ('2020-12-03 09:09:00', 37.75001907348633, -122.51163482666016, '/Users/caseydaly/images/paaiedpv.jpg', 'Great White Shark', 12, 112, 'Ocean Beach');
                """)
        mydb.commit()
        start = str(int(datetime.datetime(2020, 12, 3, 9, 8, 0).timestamp()))
        end = str(int(datetime.datetime(2020, 12, 3, 9, 10, 0).timestamp()))
        request_body = {
            "start": start,
            "end":  end
        }
        response = client.get('/api/sighting', request_body)
        assert response.status_code == 200
        json_result = response.json
        obj = {
            "date": int(datetime.datetime(2020, 12, 3, 9, 9, 0).timestamp()),
            "lat": 37.75001907348633,
            "lon": -122.51163482666016,
            "type": 'Great White Shark',
            "size": 12,
            "dist_to_shore": 112,
            "location": 'Ocean Beach'
        }
        found = False
        for sighting in json_result:
            if compare_all_but_img(obj, sighting):
                found = True
                break
        assert found
    finally:
        cursor.execute("DELETE FROM Sightings WHERE SightingDate='2020-12-03 09:09:00';")
        mydb.commit()

#insert sighting into db, and test retrieving it with only passing the 'start' parameter as a json body arg
def test_sighting_get_just_start_json_body(client):
    try:
        cursor = mydb.cursor()
        cursor.execute("""
                    INSERT INTO 
                        Sightings (SightingDate, Latitude, Longitude, ImagePath, SharkType, Length, DistanceToShore, Location)
                    VALUES
                        ('2020-12-03 09:09:00', 37.75001907348633, -122.51163482666016, '/Users/caseydaly/images/paaiedpv.jpg', 'Great White Shark', 12, 112, 'Ocean Beach');
                """)
        mydb.commit()
        start = str(int(datetime.datetime(2020, 12, 3, 9, 8, 0).timestamp()))
        request_body = {
            "start": start
        }
        response = client.get('/api/sighting', request_body)
        assert response.status_code == 200
        json_result = response.json
        obj = {
            "date": int(datetime.datetime(2020, 12, 3, 9, 9, 0).timestamp()),
            "lat": 37.75001907348633,
            "lon": -122.51163482666016,
            "type": 'Great White Shark',
            "size": 12,
            "dist_to_shore": 112,
            "location": 'Ocean Beach'
        }
        found = False
        for sighting in json_result:
            if compare_all_but_img(obj, sighting):
                found = True
                break
        assert found
    finally:
        cursor.execute("DELETE FROM Sightings WHERE SightingDate='2020-12-03 09:09:00';")
        mydb.commit()

#insert sighting into db, and test retrieving it with only passing the 'end' parameter as a json body arg
def test_sighting_get_just_end_json_body(client):
    try:
        cursor = mydb.cursor()
        cursor.execute("""
                    INSERT INTO 
                        Sightings (SightingDate, Latitude, Longitude, ImagePath, SharkType, Length, DistanceToShore, Location)
                    VALUES
                        ('2020-12-03 09:09:00', 37.75001907348633, -122.51163482666016, '/Users/caseydaly/images/paaiedpv.jpg', 'Great White Shark', 12, 112, 'Ocean Beach');
                """)
        mydb.commit()
        end = str(int(datetime.datetime(2020, 12, 3, 9, 10, 0).timestamp()))
        request_body = {
            "end":  end
        }
        response = client.get('/api/sighting', request_body)
        assert response.status_code == 200
        json_result = response.json
        obj = {
            "date": int(datetime.datetime(2020, 12, 3, 9, 9, 0).timestamp()),
            "lat": 37.75001907348633,
            "lon": -122.51163482666016,
            "type": 'Great White Shark',
            "size": 12,
            "dist_to_shore": 112,
            "location": 'Ocean Beach'
        }
        found = False
        for sighting in json_result:
            if compare_all_but_img(obj, sighting):
                found = True
                break
        assert found
    finally:
        cursor.execute("DELETE FROM Sightings WHERE SightingDate='2020-12-03 09:09:00';")
        mydb.commit()