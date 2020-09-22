from flask import Flask
app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello_world():
    response=flask.jsonify({'data':'Hello shark app, this will be predictions'})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run()
