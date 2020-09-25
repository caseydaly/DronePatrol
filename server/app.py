from flask import Flask, request, Response
from flask_cors import CORS
import jsonpickle
import numpy as np
import cv2
import os
from Model import PyTorchModel

# Initialize the Flask application
app = Flask(__name__)
CORS(app)

model = PyTorchModel("/Users/caseydaly/Downloads/septembersecond.pth") if "caseydaly" in os.getcwd() else PyTorchModel("/home/ubuntu/SharkWatch/server/model/septembersecond.pth")


# route http posts to this method
@app.route('/predict', methods=['POST'])
def test():
    r = request
    # convert string of image data to uint8
    nparr = np.fromstring(r.data, np.uint8)
    # decode image
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    print(type(img))

    # do some fancy processing here....

    labels = model.predict(img)

    response={}

    for label in labels:
        response[label.id] = {
            "group": label.group,
            "xmin": label.x_min,
            "xmax": label.x_max,
            "ymin": label.y_min,
            "ymax": label.y_max,
            "color": label.color,
            "score": label.score
        }

    # build a response dict to send back to client
    # response = {'message': 'image received. size={}x{}'.format(img.shape[1], img.shape[0])
    #             }
    # encode response using jsonpickle
    response_pickled = jsonpickle.encode(response)

    return Response(response=response_pickled, status=200, mimetype="application/json")


if __name__ == '__main__':
    app.run()
