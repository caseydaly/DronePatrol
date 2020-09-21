from flask import Flask

app = Flask(__name__)

@app.route('/predict')
def predict_image():
    return "This will be an image with predictions in the future"