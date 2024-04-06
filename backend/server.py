from flask import Flask, request
from flask_cors import CORS
 
app = Flask(__name__)
CORS(app, resources={r"/data": {"origins": "http://localhost:3000"}})
 
@app.route('/data', methods=['POST'])
def getData():
  return {
    "result": request.json['years'] * request.json['degrees']
  }
 
if __name__ == '__main__':
  app.run(debug=False)