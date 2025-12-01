from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Load the model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model_pakan.joblib')
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "online", "message": "Poultrigo ML Service is running"})

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.get_json()
        
        # Example: Expecting features in the request
        # Adjust these keys based on your actual model training features
        # features = [data['population'], data['age'], data['temperature']]
        
        # If the model expects a DataFrame (common with scikit-learn pipelines)
        # df = pd.DataFrame([data])
        
        # For now, assuming the model accepts a list of values or a 2D array
        # You might need to adjust this part based on how you trained the model
        
        # Explicitly extract features in the correct order matching training data:
        # 1. Umur (Hari) -> age
        # 2. Gender -> gender
        # 3. Populasi -> population
        # 4. Pakan Kemaren (kg) -> feedYesterday
        # 5. Sisa Pakan (kg) -> leftover
        
        features = [[
            float(data['age']),
            float(data['gender']),
            float(data['population']),
            float(data['feedYesterday']),
            float(data['leftover'])
        ]]
        
        prediction = model.predict(features)
        
        return jsonify({
            "success": True,
            "prediction": prediction[0]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
