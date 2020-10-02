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
from PredictedImage import PredictedImage

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
     predicted_image_obj = get_predicted_image_obj(frame, labels)

     #display this frame
     q.put(predicted_image_obj)
     make_prediction = True

def get_predicted_image_obj(frame, labels):
    l = list()
    for label in labels:
        if label.score > 0.8:
            l.append(label)
            label_name = label.group.lower()
            upperLeft = (label.x_min, label.y_min)
            lowerRight = (label.x_max, label.y_max)
            if label_name == "shark":
                color = (0, 0, 255)
            else:
                color = webcolors.name_to_rgb(label.color)
            #add another rectangle to the frame
            cv2.rectangle(frame, upperLeft, lowerRight, color, thickness=3)
            #add label to the prediction rectangle
            cv2.putText(frame, label_name, (label.x_min, label.y_min-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)
    return PredictedImage(frame, l)
    

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
            if len(predicted.labels) > 0:
                predicted_frame = cv2.resize(predicted.frame, (0,0), fx=0.5, fy=0.5)
                frame = cv2.imencode('.jpg', predicted_frame)[1].tobytes()
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
