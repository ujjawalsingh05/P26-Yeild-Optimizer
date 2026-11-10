from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import os
import urllib.request
import urllib.parse
import urllib.error
import json
import ssl
import tensorflow as tf
from gtts import gTTS
from dotenv import load_dotenv

# 1. FORCE EXACT PATH TO .env FILE
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=env_path)

# Clean any accidental quotes or spaces from the .env key
raw_key = os.getenv("GEMINI_API_KEY", "")
GEMINI_API_KEY = raw_key.strip().strip('"').strip("'")

if GEMINI_API_KEY:
    print(f"✅ Gemini API Key Loaded Successfully! (Starts with: {GEMINI_API_KEY[:10]}...)")
else:
    print("❌ ERROR: Gemini API Key is MISSING. Check your .env file!")

app = FastAPI()

# Allow Next.js frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Resolve paths to the ml_pipeline models directory
MODEL_DIR = os.path.join(BASE_DIR, "../ml_pipeline/models")

# 3. Load the standard ML models
rf_model = joblib.load(os.path.join(MODEL_DIR, "random_forest_model.pkl"))
xgb_model = joblib.load(os.path.join(MODEL_DIR, "xgboost_model.pkl"))
feature_names = joblib.load(os.path.join(MODEL_DIR, "feature_names.pkl"))

# 4. Safely load the LSTM Deep Learning model
try:
    lstm_model = tf.keras.models.load_model(
        os.path.join(MODEL_DIR, "lstm_model.h5"), 
        compile=False
    )
    LSTM_READY = True
except Exception as e:
    print(f"LSTM Load Warning: {e}")
    LSTM_READY = False


# --- BUILT-IN LIVE GOOGLE GTX TRANSLATOR ---
def live_translate(text: str, target_lang: str) -> str:
    if target_lang == "en" or not text.strip():
        return text
    try:
        url = (
            f"https://translate.googleapis.com/translate_a/single"
            f"?client=gtx&sl=en&tl={target_lang}&dt=t&q={urllib.parse.quote(text)}"
        )
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, timeout=5, context=ctx) as response:
            data = json.loads(response.read().decode('utf-8'))
            return "".join([item[0] for item in data[0] if item[0]])
    except Exception as e:
        print(f"Live Translation Error: {e}")
        return text


# --- REQUEST SCHEMAS ---
class CropInput(BaseModel):
    Fertilizer: float
    temp: float
    N: float
    P: float
    K: float
    lang: str = "en"

class TranslateRequest(BaseModel):
    text: str
    target_lang: str

class BatchTranslateRequest(BaseModel):
    texts: List[str]
    target_lang: str


# --- API ENDPOINTS ---

@app.post("/translate")
async def translate_single(req: TranslateRequest):
    translated = live_translate(req.text, req.target_lang)
    return {"translated_text": translated}


@app.post("/translate-batch")
async def translate_batch(req: BatchTranslateRequest):
    if req.target_lang == "en" or not req.texts:
        return {"translations": req.texts}
    
    translated_list = [live_translate(t, req.target_lang) for t in req.texts]
    return {"translations": translated_list}


@app.post("/predict")
async def predict_yield(data: CropInput):
    # Format inputs matching feature_names.pkl sequence
    input_array = np.array([[data.Fertilizer, data.temp, data.N, data.P, data.K]])
    
    # Run Random Forest & XGBoost
    rf_pred = round(float(rf_model.predict(input_array)[0]), 2)
    xgb_pred = round(float(xgb_model.predict(input_array)[0]), 2)
    
    # Run LSTM (3D input shape: samples, timesteps, features)
    if LSTM_READY:
        try:
            lstm_input = input_array.reshape((1, 1, 5))
            lstm_pred = round(float(lstm_model.predict(lstm_input, verbose=0)[0][0]), 2)
        except Exception:
            lstm_pred = 0.0
    else:
        lstm_pred = 0.0
    
    # Dynamically select the highest-performing model
    predictions = {
        "Random Forest": rf_pred, 
        "XGBoost": xgb_pred, 
        "LSTM": lstm_pred
    }
    valid_preds = {k: v for k, v in predictions.items() if isinstance(v, (int, float)) and v > 0}
    recommended_model = max(valid_preds, key=valid_preds.get) if valid_preds else "Random Forest"
    predicted_value = predictions[recommended_model]

    # --- 1. BASE FALLBACK INSIGHT (If Gemini fails or key is missing) ---
    if data.N < 50:
        insight = "Nitrogen levels are dangerously low. Consider immediate application of Urea to boost vegetative growth."
    elif data.temp > 35:
        insight = "High heat stress detected. Ensure adequate and frequent irrigation to prevent crop wilting."
    elif data.P < 20:
        insight = "Low Phosphorus. Root development may be stunted. Apply DAP fertilizer."
    else:
        insight = "Soil nutrients and temperature are optimal for maximum yield."

    # --- 2. GEMINI AI (Updated to Gemini 2.5 Flash + AQ. Auth Key Headers) ---
    if GEMINI_API_KEY:
        prompt = (
            f"You are an expert AI agronomist. A farmer has soil with Nitrogen={data.N}, "
            f"Phosphorus={data.P}, Potassium={data.K}, Temperature={data.temp}°C, and applied {data.Fertilizer}kg/ha of fertilizer. "
            f"The AI predicted a yield of {predicted_value} t/ha. Provide a concise, highly actionable 2-sentence recommendation "
            f"to optimize or protect this yield. Reply in plain text only. Do not use asterisks, markdown, or bullet points."
        )
        
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        
        # Mac SSL Bypass context
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        # Try active 2026 models in order (since 1.5-flash is retired and returns 404)
        active_models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"]
        
        for model_name in active_models:
            try:
                print(f"⏳ Contacting Gemini API ({model_name})...")
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={urllib.parse.quote(GEMINI_API_KEY)}"
                
                req = urllib.request.Request(
                    url, 
                    data=json.dumps(payload).encode('utf-8'), 
                    headers={
                        'Content-Type': 'application/json',
                        'x-goog-api-key': GEMINI_API_KEY
                    }
                )
                
                with urllib.request.urlopen(req, timeout=15, context=ctx) as response:
                    res_data = json.loads(response.read().decode('utf-8'))
                    if 'candidates' in res_data and len(res_data['candidates']) > 0:
                        generated_text = res_data['candidates'][0]['content']['parts'][0]['text']
                        insight = generated_text.replace("*", "").strip()
                        print(f"✅ Gemini Insight Generated Successfully using {model_name}!")
                        break  # Stop loop once we get a valid insight
            except urllib.error.HTTPError as e:
                error_body = e.read().decode('utf-8', errors='ignore')
                print(f"⚠️ {model_name} HTTP Error {e.code}: {error_body}")
            except Exception as e:
                print(f"❌ Gemini REST API Error ({model_name}): {e}")

    # --- 3. Live translate the insight if Hindi ('hi') or Punjabi ('pa') is selected ---
    if data.lang != "en":
        insight = live_translate(insight, data.lang)

    return {
        "predicted_yield": predicted_value,
        "model": recommended_model,
        "insight": insight,
        "all_predictions": {
            "random_forest": rf_pred,
            "xgboost": xgb_pred,
            "lstm": lstm_pred if lstm_pred > 0 else "Offline",
            "recommended_model": recommended_model
        }
    }


@app.get("/tts")
async def text_to_speech(text: str, lang: str = "en"):
    audio_dir = os.path.join(BASE_DIR, "audio_cache")
    os.makedirs(audio_dir, exist_ok=True)
    file_path = os.path.join(audio_dir, "speech.mp3")
    
    tts = gTTS(text=text, lang=lang)
    tts.save(file_path)
    
    return FileResponse(file_path, media_type="audio/mpeg")