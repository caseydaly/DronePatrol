from flask import Flask, request, Response, render_template
from flask_cors import CORS
import jsonpickle
import numpy as np
import cv2
import os
import time

# Initialize the Flask application
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

def gen():
    i = 0
    cap = cv2.VideoCapture('/Users/caseydaly/sharkwatch/server/test_vid/video4.mp4')
    while (cap.isOpened()):
        ret, img = cap.read()
        if ret:
            img = cv2.resize(img, (0,0), fx=0.5, fy=0.5)
            frame = cv2.imencode('.jpg', img)[1].tobytes()
            print("sending to client")
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        else:
            break

@app.route('/video_feed')
def video_feed():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run()
