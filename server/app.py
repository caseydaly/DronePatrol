import flask
from flask import Flask, Response, request, send_file
from flask_cors import CORS
import io
from io import BytesIO
from base64 import encodebytes
import PIL
from PIL import Image
import cv2
import numpy as np
app = Flask(__name__)
CORS(app)

def get_response_image(image_path):
    pil_img = Image.open(image_path, mode='r') # reads the PIL image
    byte_arr = io.BytesIO()
    pil_img.save(byte_arr, format='PNG') # convert the PIL image to byte array
    encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64
    return encoded_img

#return a prediction
@app.route('/', methods=['GET', 'POST'])
def hello_world():
    if request.method == 'GET':
        response=flask.jsonify({"some":"this is new data"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    print(request)
    print(type(request.data))

    byte_str = cv2.imdecode(request.data)
    
    return "workin good!"


def serve_pil_image(numpy_image):
    print(numpy_image)
    img_crop_pil = Image.fromarray(numpy_image)
    byte_io = BytesIO()
    img_crop_pil.save(byte_io, format="JPG")
    jpg_buffer = byte_io.getvalue()
    byte_io.close()
    return send_file(img_io, mimetype='image/jpeg')


if __name__ == '__main__':
    app.run()
