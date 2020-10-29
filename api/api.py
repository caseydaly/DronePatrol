from flask import Flask
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

sighting_example = {
    "image": "this will be an image in the future",
    "lat": 121.224,
    "long": -119.563,
    "date": "10-28-2020"
}

parser = reqparse.RequestParser()
parser.add_argument('image')

class Sighting(Resource):
    def get(self):
        return {'hello': 'world'}

    def post(self):
        print("post method")

api.add_resource(Sighting, '/api/sighting')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
