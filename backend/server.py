from flask import Flask, request
from flask_cors import CORS

from datasets.temperature import cost_of_temp_lowering
 
app = Flask(__name__)
CORS(app, resources={r"/data": {"origins": "*"}})
 
@app.route('/data', methods=['POST'])
def getData():
  data = request.json
  result = cost_of_temp_lowering(target_temperature_increase=data['degrees'], number_of_years=data['years'])
  return {"result": result}
 
if __name__ == '__main__':
  app.run(debug=False)