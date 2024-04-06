from flask import Flask, request
from flask_cors import CORS
 
app = Flask(__name__)
CORS(app, resources={r"/data": {"origins": "*"}})
 
@app.route('/data', methods=['POST'])
def getData():
  data = request.json
  result = data['years'] * data['degrees']
  return {"result": result}
 
if __name__ == '__main__':
  app.run(debug=False)