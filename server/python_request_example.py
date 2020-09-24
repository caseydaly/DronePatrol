from __future__ import print_function
import requests
import json
import cv2
import numpy as np
import time
import base64
import os.path
from sys import getsizeof
import pickle
import utils



def test():
    f = "/Users/caseydaly/Desktop/video4.mp4"
    if os.path.isfile(f):
        print("exists")
        vidcap = cv2.VideoCapture(f)
        success, frame = vidcap.read()
    else:
        print("file " + f + " doesn't exist")
        return

    while success:

        print("image type is: " + str(type(frame)))

        bytes_io = utils.get_bytes_from_img(frame)

        send_request(bytes_io)

        time.sleep(10)


        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

        success, frame = vidcap.read()

def send_request(bytes_io) -> np.ndarray:
    addr = 'http://127.0.0.1:5000/'

    print("type just before sending is: " + str(type(bytes_io)))

    header = {"content-type": "image/jpeg"}

    # send http request with image and receive response
    response = requests.post(addr, data=bytes_io, headers=header)
    # print(str(type(response.text)))
    # json_response = json.loads(response.text)
    # print(json_response)
    # print(str(type(json_response)))
    time.sleep(10)

if __name__ == '__main__' :
    test()