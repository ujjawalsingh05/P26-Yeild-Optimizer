import os
import joblib
import numpy as np
import tensorflow as tf
from sklearn.metrics import r2_score
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PIPELINE_DIR = os.path.join(BASE_DIR, "../ml_pipeline")
MODEL_DIR = os.path.join(PIPELINE_DIR, "models")

print("Loading data...")
df = pd.read_csv(os.path.join(PIPELINE_DIR, "data/real_crop_data.csv"))

# This will print your exact column names so you can see the spelling!
print("\n🔍 YOUR CSV COLUMNS ARE:")
print(df.columns.tolist())
print("-" * 40)

# ==========================================
# ⚠️ CHANGE "Yield" TO YOUR EXACT COLUMN NAME 
# based on what prints out above (e.g., "yield", "Production", etc.)
# ==========================================
TARGET_COLUMN_NAME = "yeild" 
# ==========================================
# ==========================================

if TARGET_COLUMN_NAME not in df.columns:
    print(f"❌ ERROR: The column '{TARGET_COLUMN_NAME}' is not in your CSV.")
    print("Please look at the list above and update TARGET_COLUMN_NAME on line 19!")
    exit()

print("Loading model...")
X = df[['Fertilizer', 'temp', 'N', 'P', 'K']].values 
y_true = df[TARGET_COLUMN_NAME].values 

X_lstm = X.reshape((X.shape[0], 1, X.shape[1]))

lstm_model = tf.keras.models.load_model(os.path.join(MODEL_DIR, "lstm_model.h5"), compile=False)

print("Running predictions...")
y_pred = lstm_model.predict(X_lstm, verbose=0)
score = r2_score(y_true, y_pred)

print("=====================================")
print(f"✅ LSTM R-squared Accuracy: {score:.3f}")
print(f"   (This means it is {score * 100:.1f}% accurate)")
print("=====================================")