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

    @classmethod
    def teardown_class(self):
        cursor = self.db.cursor()
        cursor.execute("DELETE FROM Alerts WHERE PhoneNumber='1111111111';")
        self.db.commit()

    def setup_method(self, method):
        self.insert_obj = {
            "phone": "1111111111",
            "location": "Salmon Creek",
            "radius": 5
        }
        cursor = self.db.cursor()
        cursor.execute("DELETE FROM Alerts WHERE PhoneNumber='1111111111';")
        self.db.commit()

    #return true if db contains sighting, false otherwise
    def db_contains_alert_info(self, alert_info):
        cursor = self.db.cursor()
        cursor.execute("""
            SELECT 
                * 
            FROM 
                alert_info 
            WHERE 
                PhoneNumber=%s AND Radius=%s;
                """, (alert_info['phone'], alert_info['radius']))
        results = cursor.fetchall()
        if cursor.rowcount > 0:
            return True
        return False

    def test_good_data(self):
        response = self.client.post('/api/signup', json=self.insert_obj)
        assert response.status_code == 200
        found = self.db_contains_alert_info(self.insert_obj)
        assert found

    def test_good_data_int_phone(self):
        self.insert_obj['phone'] = int(self.insert_obj['phone'])
        response = self.client.post('/api/signup', json=self.insert_obj)
        assert response.status_code == 200
        found = self.db_contains_alert_info(self.insert_obj)
        assert found

    def test_wrong_phone_type(self):
        bad_obj = self.insert_obj
        bad_obj['phone'] = 111.1111111
        response = self.client.post('/api/signup', json=bad_obj)        
        assert response.status_code == 400
        assert response.data == b"'phone' field must be of type string or integer"

    def test_bad_phone_str(self):
        bad_obj = self.insert_obj
        bad_obj['phone'] = "string, but not a number"
        response = self.client.post('/api/signup', json=bad_obj)        
        assert response.status_code == 400
        assert response.data == b"'phone' field must be an integer or string containing only numbers"


    def test_wrong_location_type(self):
        bad_obj = self.insert_obj
        bad_obj['location'] = 123
        response = self.client.post('/api/signup', json=bad_obj)        
        assert response.status_code == 400
        assert response.data == b"'location' field must be of type string"

    def test_wrong_radius_type(self):
        bad_obj = self.insert_obj
        bad_obj['radius'] = "not a number"
        response = self.client.post('/api/signup', json=bad_obj)        
        assert response.status_code == 400
        assert response.data == b"'radius' field must be of type integer"

    def test_incorrect_phone_number_length(self):
        bad_obj = self.insert_obj
        bad_obj['phone'] = "11111111111"
        response = self.client.post('/api/signup', json=bad_obj)        
        assert response.status_code == 400
        assert response.data == b"length of 'phone' field in request must be 10"

    def test_negative_radius(self):
        bad_obj = self.insert_obj
        bad_obj['radius'] = -(bad_obj['radius'])
        response = self.client.post('/api/signup', json=bad_obj)        
        assert response.status_code == 400
        assert response.data == b"'radius' field must be greater than 0"

    def test_missing_phone_number(self):
        bad_obj = self.insert_obj
        del bad_obj['phone']
        response = self.client.post('/api/signup', json=bad_obj)
        assert response.status_code == 400
        assert response.data == b"Must include the 'phone' field in request body"

    def test_missing_location(self):
        bad_obj = self.insert_obj
        del bad_obj['location']
        response = self.client.post('/api/signup', json=bad_obj)
        assert response.status_code == 400
        assert response.data == b"Must include the 'location' field in request body"

    def test_missing_radius(self):
        bad_obj = self.insert_obj
        del bad_obj['radius']
        response = self.client.post('/api/signup', json=bad_obj)
        assert response.status_code == 400
        assert response.data == b"Must include the 'radius' field in request body"