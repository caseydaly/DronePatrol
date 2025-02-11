import os
import mysql.connector
import pytest
from app import app
import datetime
import yaml


def get_db():
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
        return mydb

class TestClass:

    @pytest.fixture(autouse=True)
    def client(self):
        app.config['TESTING'] = True
        with app.test_client() as client:
            self.client = client

    @classmethod
    def setup_class(self):
        self.db = get_db()
        self.ref_obj = {
            "date": int(datetime.datetime(2020, 12, 3, 9, 9, 0).timestamp()),
            "lat": 37.75001907348633,
            "lon": -122.51163482666016,
            "img": "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",
            "type": "Great White Shark",
            "size": 12,
            "dist_to_shore": 112,
            "location": "Ocean Beach"
        }

    @classmethod
    def teardown_class(self):
        cursor = self.db.cursor()
        cursor.execute("DELETE FROM Sightings WHERE SightingDate='2020-12-03 09:09:00';")
        self.db.commit()

    def setup_method(self, method):
        self.insert_obj = {
            "date": int(datetime.datetime(2020, 12, 3, 9, 9, 0).timestamp()),
            "lat": 37.75001907348633,
            "lon": -122.51163482666016,
            "img": "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"
        }
        cursor = self.db.cursor()
        cursor.execute("DELETE FROM Sightings WHERE SightingDate='2020-12-03 09:09:00';")
        self.db.commit()

    #return true if db contains sighting, false otherwise
    def db_contains_sighting(self, sighting):
        cursor = self.db.cursor()
        datetime_date = datetime.datetime.fromtimestamp(sighting['date'])
        cursor.execute("""
            SELECT 
                * 
            FROM 
                Sightings 
            WHERE 
                SightingDate=%s AND Latitude=%s AND Longitude=%s;
                """, (datetime_date, sighting['lat'], sighting['lon']))
        results = cursor.fetchall()
        if cursor.rowcount > 0:
            return True
        return False

    def compare(self, sighting1, sighting2):
        return ("date" in sighting1 and "date" in sighting2 and sighting1['date'] == sighting2['date']) \
            and ("lat" in sighting1 and "lat" in sighting2 and sighting1['lat'] == sighting2['lat']) \
            and ("lon" in sighting1 and "lon" in sighting2 and sighting1['lon'] == sighting2['lon']) \
            and ("type" in sighting1 and "type" in sighting2 and sighting1['type'] == sighting2['type']) \
            and ("size" in sighting1 and "size" in sighting2 and sighting1['size'] == sighting2['size']) \
            and ("dist_to_shore" in sighting1 and "dist_to_shore" in sighting2 and sighting1['dist_to_shore'] == sighting2['dist_to_shore']) \
            and ("location" in sighting1 and "location" in sighting2 and sighting1['location'] == sighting2['location']) \
            and ("img" in sighting1 and "img" in sighting2 and sighting1['img'] == sighting2['img'])

    
    #test inserting sighting via api
    def test_good_data(self):
        response = self.client.post('/api/sighting', json=self.insert_obj)
        assert response.status_code == 200
        found = self.db_contains_sighting(self.insert_obj)
        assert found

    def test_wrong_date_type(self):
        bad_obj = self.insert_obj
        bad_obj['date'] = "notAnInt"
        response = self.client.post('/api/sighting', json=bad_obj)
        assert response.status_code == 400
        assert response.data == b"'date' field must be an integer representing a unix time stamp"


    def test_wrong_lat_type(self):
        bad_obj = self.insert_obj
        bad_obj['lat'] = "notAFloat"
        response = self.client.post('/api/sighting', json=bad_obj)
        assert response.status_code == 400
        assert response.data == b"'lat' field must be of type float"

    def test_wrong_long_type(self):
        bad_obj = self.insert_obj
        bad_obj['lon'] = "notAFloat"
        response = self.client.post('/api/sighting', json=bad_obj)
        assert response.status_code == 400
        assert response.data == b"'lon' field must be of type float"

    def test_wrong_img_type(self):
        bad_obj = self.insert_obj
        bad_obj['img'] = 2346234
        response = self.client.post('/api/sighting', json=bad_obj)
        assert response.status_code == 400
        assert response.data == b"'img' field must be a base64 encoded string"

    def test_missing_date(self):
        bad_obj = self.insert_obj
        del bad_obj['date']
        response = self.client.post('/api/sighting', json=bad_obj)
        assert response.status_code == 400
        assert response.data == b"Must include the 'date' field in request body"

    def test_missing_lat(self):
        bad_obj = self.insert_obj
        del bad_obj['lat']
        response = self.client.post('/api/sighting', json=bad_obj)
        assert response.status_code == 400
        assert response.data == b"Must include the 'lat' field in request body"

    def test_missing_lon(self):
        bad_obj = self.insert_obj
        del bad_obj['lon']
        response = self.client.post('/api/sighting', json=bad_obj)
        assert response.status_code == 400
        assert response.data == b"Must include the 'lon' field in request body"

    def test_missing_img(self):
        bad_obj = self.insert_obj
        del bad_obj['img']
        response = self.client.post('/api/sighting', json=bad_obj)
        assert response.status_code == 400
        assert response.data == b"Must include the 'img' field in request body"

    #pass an integer that might overflow the db limit for that column
    def test_date_large(self):
        bad_obj = self.insert_obj
        bad_obj['date'] = 1834752387460237468723498672398476982347698234769823476987234986723498760293847569843762346
        response = self.client.post('/api/sighting', json=bad_obj)
        assert response.status_code == 400
        assert response.data == b"'date' field specified is too large"