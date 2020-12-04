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
        self.ref_obj = {
            "date": int(datetime.datetime(2020, 12, 3, 9, 9, 0).timestamp()),
            "lat": 37.75001907348633,
            "lon": -122.51163482666016,
            "type": 'Great White Shark',
            "size": 12,
            "dist_to_shore": 112,
            "location": 'Ocean Beach'
        }
    
    @classmethod
    def setup_class(cls):
        database = get_db()
        cursor = database.cursor()
        cursor.execute("""
                    INSERT INTO 
                        Sightings (SightingDate, Latitude, Longitude, ImagePath, SharkType, Length, DistanceToShore, Location)
                    VALUES
                        ('2020-12-03 09:09:00', 37.75001907348633, -122.51163482666016, '/Users/caseydaly/images/paaiedpv.jpg', 'Great White Shark', 12, 112, 'Ocean Beach');
                """)
        database.commit()

    @classmethod
    def teardown_class(cls):
        cursor.execute("DELETE FROM Sightings WHERE SightingDate='2020-12-03 09:09:00';")
        mydb.commit()

    # def setup_method(self, method):
    #     pass

    # def teardown_method(self, method):
    #     pass

    def test_base_path(self):
        response = self.client.get('/')
        assert response.status_code == 200

    def compare_all_but_img(self, sighting1, sighting2):
        return ("date" in sighting1 and "date" in sighting2 and sighting1['date'] == sighting2['date']) \
            and ("lat" in sighting1 and "lat" in sighting2 and sighting1['lat'] == sighting2['lat']) \
            and ("lon" in sighting1 and "lon" in sighting2 and sighting1['lon'] == sighting2['lon']) \
            and ("type" in sighting1 and "type" in sighting2 and sighting1['type'] == sighting2['type']) \
            and ("size" in sighting1 and "size" in sighting2 and sighting1['size'] == sighting2['size']) \
            and ("dist_to_shore" in sighting1 and "dist_to_shore" in sighting2 and sighting1['dist_to_shore'] == sighting2['dist_to_shore']) \
            and ("location" in sighting1 and "location" in sighting2 and sighting1['location'] == sighting2['location'])

    
    #test retrieving sighting
    def test_sighting_get_url_args(self):
        start = str(int(datetime.datetime(2020, 12, 3, 9, 8, 0).timestamp()))
        end = str(int(datetime.datetime(2020, 12, 3, 9, 10, 0).timestamp()))
        response = self.client.get('/api/sighting?start=' + start + '&end=' + end)
        assert response.status_code == 200
        json_result = response.json
        found = False
        for sighting in json_result:
            if self.compare_all_but_img(self.ref_obj, sighting):
                found = True
                break
        assert found == True

    #test retrieving sighting with only passing the 'start' parameter as a url arg
    def test_sighting_get_just_start_url(self):
        start = str(int(datetime.datetime(2020, 12, 3, 9, 8, 0).timestamp()))
        url = '/api/sighting?start=' + start
        response = self.client.get(url)
        assert response.status_code == 200
        json_result = response.json
        found = False
        for sighting in json_result:
            if self.compare_all_but_img(self.ref_obj, sighting):
                found = True
                break
        assert found

    #test retrieving sighting with only passing the 'end' parameter as a url arg
    def test_sighting_get_just_end_url(self):
        end = str(int(datetime.datetime(2020, 12, 3, 9, 10, 0).timestamp()))
        response = self.client.get('/api/sighting?end=' + end)
        assert response.status_code == 200
        json_result = response.json
        found = False
        for sighting in json_result:
            if self.compare_all_but_img(self.ref_obj, sighting):
                found = True
                break
        assert found

    #test retrieving sighting via sighting method with a json request body
    def test_sighting_get_json_body(self):
        start = str(int(datetime.datetime(2020, 12, 3, 9, 8, 0).timestamp()))
        end = str(int(datetime.datetime(2020, 12, 3, 9, 10, 0).timestamp()))
        request_body = {
            "start": start,
            "end":  end
        }
        response = self.client.get('/api/sighting', request_body)
        assert response.status_code == 200
        json_result = response.json
        found = False
        for sighting in json_result:
            if self.compare_all_but_img(self.ref_obj, sighting):
                found = True
                break
        assert found

    #test retrieving sighting with only passing the 'start' parameter as a json body arg
    def test_sighting_get_just_start_json_body(self):
        start = str(int(datetime.datetime(2020, 12, 3, 9, 8, 0).timestamp()))
        request_body = {
            "start": start
        }
        response = self.client.get('/api/sighting', request_body)
        assert response.status_code == 200
        json_result = response.json
        found = False
        for sighting in json_result:
            if self.compare_all_but_img(self.ref_obj, sighting):
                found = True
                break
        assert found

    #test retrieving sighting with only passing the 'end' parameter as a json body arg
    def test_sighting_get_just_end_json_body(self):
        end = str(int(datetime.datetime(2020, 12, 3, 9, 10, 0).timestamp()))
        request_body = {
            "end":  end
        }
        response = self.client.get('/api/sighting', request_body)
        assert response.status_code == 200
        json_result = response.json
        found = False
        for sighting in json_result:
            if self.compare_all_but_img(self.ref_obj, sighting):
                found = True
                break
        assert found


#insert sighting into db and test retrieving it

#insert sighting into db and test retrieving it

#insert sighting into db and test retrieving it