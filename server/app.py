#!/usr/bin/env python
import sys
from flask import Flask, render_template, Response
import os
import cv2


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

def gen():
    mp4_file = os.getcwd() + '/test_vid/video4.mp4'
    cap = cv2.VideoCapture(mp4_file)
    ret, img = cap.read()
    while ret:
        print("sending image")
        img = cv2.resize(img, (0,0), fx=0.5, fy=0.5)
        frame = cv2.imencode('.jpg', img)[1].tobytes()
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        ret, img = cap.read()

@app.route('/video_feed')
def video_feed():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
