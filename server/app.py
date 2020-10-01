#!/usr/bin/env python
import sys
from flask import Flask, render_template, Response, request
from flask_cors import CORS
import os
import cv2  
import jsonpickle
import numpy as np
from Model import PyTorchModel
from queue import Queue
from threading import Thread
import time
import webcolors
import youtube_dl
import pafy

video_id = None
ydl_opts = {
    'nocheckcertificate:': True
}

q = Queue() 
if "caseydaly" in os.getcwd():
    model_file = os.getcwd() + "/model/septembersecond.pth" 
else:
    model_file = "/home/ubuntu/SharkWatch/server/model/septembersecond.pth"

model = PyTorchModel(model_file)
make_prediction = True

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    global video_id
    print("home page")
    video_id = request.args.get('v')
    print("video_id: " + str(video_id))
    return render_template('index.html')

def predict(frame, model, mp4_file):
     global make_prediction, current_frame
     #run model predictions

     #print("type of frame is: " + str(type(frame)))
     labels = model.predict(frame)

     #display bounding boxes with labels
     display_bounding_boxes(frame, labels)

     #display this frame
     q.put(frame)
     make_prediction = True

def display_bounding_boxes(frame, labels):
    for label in labels:
        #if label.score > 0.8:
        label_name = label.group.lower()
        upperLeft = (label.x_min, label.y_min)
        lowerRight = (label.x_max, label.y_max)
        #print(label_name + " at " + str(upperLeft) + " " + str(lowerRight))
        cv2.rectangle(frame, upperLeft, lowerRight, webcolors.name_to_rgb(label.color), thickness=3)

def gen():
    global make_prediction, video_id
    mp4_file = os.getcwd() + '/test_vid/video4.mp4'
    if video_id is None:
        print("No video ID, running predictions on local .mp4 file")
        cap = cv2.VideoCapture(mp4_file)
    else:
        print("found video ID, running prediction on youtube video")
        url = "https://www.youtube.com/watch?v=" + video_id
        video = pafy.new(url, ydl_opts=ydl_opts)
        best = video.getbest(preftype="mp4")
        cap = cv2.VideoCapture()
        cap.open(best.url)
    ret, img = cap.read()
    i = 0
    while ret:
        if not q.empty():
            predicted = q.get()
            predicted = cv2.resize(predicted, (0,0), fx=0.5, fy=0.5)
            frame = cv2.imencode('.jpg', predicted)[1].tobytes()
            print("made prediction")
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        elif make_prediction:
            make_prediction = False
            thread = Thread(target=predict, args=(img, model, mp4_file))
            thread.start()
        ret, img = cap.read()

@app.route('/video_feed', methods=['GET', 'POST'])
def video_feed():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
