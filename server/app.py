#!/usr/bin/env python
import sys
sys.stdout = open('/home/ubuntu/SharkWatch/server/output.txt', 'a+')
from flask import Flask, render_template, Response



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
        frame = cv2.imencode('.jpg', img)[1].tobytes()
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
