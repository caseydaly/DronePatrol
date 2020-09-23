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



def test():
    if os.path.isfile("/Users/caseydaly/Desktop/video4.mp4"):
        print("exists")
        vidcap = cv2.VideoCapture("/Users/caseydaly/Desktop/video4.mp4")
        success, frame = vidcap.read()
    else:
        print("doesn't exist")
        return

    while success:



        retval, buffer = cv2.imencode('.jpg', frame)

        print(str(type(buffer)))

        # Convert to base64 encoding and show start of data
        jpg_as_text = base64.b64encode(buffer)
        print(jpg_as_text[:80])
        print(str(type(jpg_as_text)))


        # Convert back to binary
        jpg_original = base64.b64decode(jpg_as_text)
        print(str(type(jpg_original)))
        jpg_as_np = np.frombuffer(jpg_original, dtype=np.uint8)
        print(str(type(jpg_as_np)))

    

        image_buffer = cv2.imdecode(jpg_as_np, flags=1)
        print(str(type(image_buffer)))

        cv2.imshow("frame", image_buffer)


        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

        success, frame = vidcap.read()

        # Write to a file to show conversion worked
        # with open('test.jpg', 'wb') as f_output:
        #     f_output.write(jpg_original)

        # addr = 'http://127.0.0.1:5000/'


        # prepare headers for http request
        # content_type = 'image/jpeg'
        # headers = {'content-type': content_type}

        # print("type just before sending is: " + str(type(jpg)))
        # # send http request with image and receive response
        # response = requests.post(addr, data=jpg, headers=headers)

        # print(json.loads(response.text))

        # cv2.imshow("image", img)
        # time.sleep(10)



        # expected output: {u'message': u'image received. size=124x124'}

if __name__ == '__main__' :
    test()