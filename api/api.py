from flask import Flask
from flask_restful import Resource, Api, reqparse
import scrapeSurfline
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
api = Api(app)

sighting_example = {
    "image": "this will be an image in the future",
    "lat": 121.224,
    "long": -119.563,
    "date": "10-28-2020"
}

parser = reqparse.RequestParser()
parser.add_argument('image')
parser.add_argument('lat')
parser.add_argument('lon')
parser.add_argument('date')

class Sighting(Resource):
    def get(self):
        return {'hello': 'world'}

    def post(self):
        args = parser.parse_args()
        print(args["image"])
        print(args["lat"])
        print(args["lon"])
        print(args["date"])

class Spots(Resource):
    def get(self):
        return scrapeSurfline.get_spots()

api.add_resource(Sighting, '/api/sighting')

api.add_resource(Spots, '/api/spots')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
