from flask import Flask
from flask import send_file

app = Flask(__name__)

@app.route('/predict')
def predict_image():
    return send_file("./prediction.png", mimetype='image/png')