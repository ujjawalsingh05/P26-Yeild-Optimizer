import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Input
import joblib
import os

model_dir = "models"
os.makedirs(model_dir, exist_ok=True)

print("1. Loading REAL Dataset...")
# Assuming you named the downloaded file real_crop_data.csv
df = pd.read_csv('data/real_crop_data.csv')

# The exact column name from your screenshot
target_column = 'yeild' 

# Drop any empty rows just to be safe
df = df.dropna()

X = df.drop(target_column, axis=1)
y = df[target_column]

# Split into training and testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Training on {len(X_train)} samples with {X_train.shape[1]} features (Fertilizer, temp, N, P, K)...")

# --- TRAIN MODELS ---
print("\n2. Training Random Forest...")
rf_model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
rf_model.fit(X_train, y_train)
rf_pred = rf_model.predict(X_test)
print(f"RF MAE: {mean_absolute_error(y_test, rf_pred):.3f} | R2: {r2_score(y_test, rf_pred):.3f}")
joblib.dump(rf_model, f'{model_dir}/random_forest_model.pkl')

print("\n3. Training XGBoost...")
xgb_model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42, n_jobs=-1)
xgb_model.fit(X_train, y_train)
xgb_pred = xgb_model.predict(X_test)
print(f"XGBoost MAE: {mean_absolute_error(y_test, xgb_pred):.3f} | R2: {r2_score(y_test, xgb_pred):.3f}")
joblib.dump(xgb_model, f'{model_dir}/xgboost_model.pkl')

print("\n4. Training LSTM...")
X_train_lstm = np.array(X_train).reshape((X_train.shape[0], 1, X_train.shape[1])).astype(np.float32)
X_test_lstm = np.array(X_test).reshape((X_test.shape[0], 1, X_test.shape[1])).astype(np.float32)
y_train_keras = np.asarray(y_train).astype(np.float32)

lstm_model = Sequential([
    Input(shape=(1, X_train.shape[1])),
    LSTM(50, activation='relu'),
    Dense(1)
])
lstm_model.compile(optimizer='adam', loss='mse')
lstm_model.fit(X_train_lstm, y_train_keras, epochs=20, batch_size=32, verbose=0)
lstm_pred = lstm_model.predict(X_test_lstm, verbose=0)
print(f"LSTM MAE: {mean_absolute_error(y_test, lstm_pred):.3f}")
lstm_model.save(f'{model_dir}/lstm_model.h5')

joblib.dump(X.columns.tolist(), f'{model_dir}/feature_names.pkl')
print("\nReal Data Pipeline Complete! Models updated.")