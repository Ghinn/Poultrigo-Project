from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)

# Load Model
# Ensure the model exists before loading
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'feed_model.pkl')

if not os.path.exists(MODEL_PATH):
    print(f"Model not found at {MODEL_PATH}. Please run train_model.py first.")
    model = None
else:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully.")

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not loaded. Run train_model.py first.'}), 500

    try:
        data = request.get_json()
        
        # Extract features
        population = float(data.get('population'))
        age = float(data.get('age'))
        feed_given_yesterday = float(data.get('feed_given_yesterday'))
        feed_leftover_yesterday = float(data.get('feed_leftover_yesterday'))

        # Create DataFrame for prediction
        input_data = pd.DataFrame({
            'population': [population],
            'age': [age],
            'feed_given_yesterday': [feed_given_yesterday],
            'feed_leftover_yesterday': [feed_leftover_yesterday]
        })

        # Predict
        prediction = model.predict(input_data)[0]

        return jsonify({
            'success': True,
            'predicted_feed_kg': round(prediction, 2),
            'message': 'Prediction successful'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

@app.route('/', methods=['GET'])
def home():
    return "<h1>Poultrigo ML Service is Running!</h1><p>Use /predict endpoint for predictions.</p>"

if __name__ == '__main__':
    app.run(port=5000, debug=True)
