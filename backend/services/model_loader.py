import joblib
from tensorflow.keras.models import load_model
import os

# Point to the ml_pipeline/models folder
MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../ml_pipeline/models'))

def load_all_models():
    print("Loading ML models into memory...")
    rf_model = joblib.load(f"{MODEL_DIR}/random_forest_model.pkl")
    xgb_model = joblib.load(f"{MODEL_DIR}/xgboost_model.pkl")
    
    # Add compile=False to prevent the 'mse' TypeError
    lstm_model = load_model(f"{MODEL_DIR}/lstm_model.h5", compile=False)
    
    print("Models loaded successfully!")
    return rf_model, xgb_model, lstm_model