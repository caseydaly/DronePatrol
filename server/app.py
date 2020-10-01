import sys
sys.stdout = open('/home/ubuntu/SharkWatch/server/output.txt', 'a+')
print("app.py")
from werkzeug.debug import DebuggedApplication
import datetime
now = datetime.datetime.now()
print(now.strftime("%Y-%m-%d %H:%M:%S"))
from flask import Flask, request, Response, render_template
from flask_cors import CORS
import jsonpickle
import numpy as np
import cv2
import os
import time
from Model import PyTorchModel
from queue import Queue
from threading import Thread
import webcolors
print("1")
q = Queue() #thread safe way to return values from the launched threads
print("2")
# Initialize the Flask application
app = Flask(__name__)
app.debug = True
app.wsgi_app = DebuggedApplication(app.wsgi_app, evalex=True, pin_security=False)

CORS(app)
print("3")
model = PyTorchModel("/home/ubuntu/SharkWatch/server/model/septembersecond.pth")
make_prediction = True
print("4")

@app.route('/')
def index():
    print("rendering template")
    return render_template('index.html')

def predict(frame, model, mp4_file):
    global make_prediction, current_frame
    #run model predictions

    #print("type of frame is: " + str(type(frame)))
    #labels = model.predict(frame)

    #display bounding boxes with labels
    #display_bounding_boxes(frame, labels)

    # #display lines between sharks and other sharks or sharks and people, with distances labeled
    # if frame_has_shark(labels):
    #     shark_distances = get_distances_from_sharks(labels)
    #     display_distances(frame, shark_distances)

    #display this frame
    #frame = cv2.resize(frame, dsize=(1024, 540), interpolation=cv2.INTER_CUBIC)
    q.put(frame)
    make_prediction = True

def display_bounding_boxes(frame, labels):
    for label in labels:
        #if label.score > 0.8:
        label_name = label.group.lower()
        upperLeft = (label.x_min, label.y_min)
        lowerRight = (label.x_max, label.y_max)
        print(label_name + " at " + str(upperLeft) + " " + str(lowerRight))
        cv2.rectangle(frame, upperLeft, lowerRight, webcolors.name_to_rgb(label.color), thickness=3)

def gen():
    global make_prediction, model
    print("gen")
    i = 0
    mp4_file = os.getcwd() + '/test_vid/video4.mp4'
    cap = cv2.VideoCapture(mp4_file)
    print(os.getcwd())
    while (cap.isOpened()):
        ret, img = cap.read()
        if ret:
            if not q.empty():
                predicted = q.get()
                predicted = cv2.resize(img, (0,0), fx=0.5, fy=0.5)
                frame = cv2.imencode('.jpg', img)[1].tobytes()
                print(i)
                yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            elif make_prediction:
                make_prediction = False
                thread = Thread(target=predict, args=(img, model, mp4_file))
                thread.start()
                print("here")
            i+=1
            time.sleep(1)
        else:
            print("finished reading video frames")
            break

@app.route('/video_feed')
def video_feed():
    print("video feed")
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run()
