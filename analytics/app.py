import random
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

print("Started Python Machine Learning Engine Server...")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "running"}), 200

@app.route('/predict', methods=['GET'])
def predict():
    """
    Simulates a machine learning prediction pipeline.
    It returns the expected usage, plus ANOMALY DETECTION if the variance spikes over a defined safety limit.
    """
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    predictions = []
    
    base_electricity = 4500
    safe_limit_threshold = 5300 # Anything above this is flagged by our AI as an anomaly
    
    for day in days:
        predicted = base_electricity + random.randint(-800, 1500)
        actual = predicted + random.randint(-300, 300)
        
        anomaly = actual > safe_limit_threshold
        
        predictions.append({
            "day": day,
            "predictedElectricity": predicted,
            "actualElectricity": actual,
            "anomaly_detected": anomaly
        })

    return jsonify(predictions)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
