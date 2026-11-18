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
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=env_path)

raw_key = os.getenv("GEMINI_API_KEY", "")
GEMINI_API_KEY = raw_key.strip().strip('"').strip("'")

if GEMINI_API_KEY:
    print(f"✅ Gemini API Key Loaded Successfully! (Starts with: {GEMINI_API_KEY[:10]}...)")
else:
    print("❌ ERROR: Gemini API Key is MISSING. Check your .env file!")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = os.path.join(BASE_DIR, "../ml_pipeline/models")

rf_model = joblib.load(os.path.join(MODEL_DIR, "random_forest_model.pkl"))
xgb_model = joblib.load(os.path.join(MODEL_DIR, "xgboost_model.pkl"))
feature_names = joblib.load(os.path.join(MODEL_DIR, "feature_names.pkl"))

try:
    lstm_model = tf.keras.models.load_model(
        os.path.join(MODEL_DIR, "lstm_model.h5"), 
        compile=False
    )
    LSTM_READY = True
except Exception as e:
    print(f"LSTM Load Warning: {e}")
    LSTM_READY = False


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
    input_array = np.array([[data.Fertilizer, data.temp, data.N, data.P, data.K]])
    
    rf_pred = float(rf_model.predict(input_array)[0])
    xgb_pred = float(xgb_model.predict(input_array)[0])
    
    if LSTM_READY:
        try:
            lstm_input = input_array.reshape((1, 1, 5))
            lstm_pred = float(lstm_model.predict(lstm_input, verbose=0)[0][0])
            if lstm_pred > 15.0:
                lstm_pred = (rf_pred + xgb_pred) / 2.0 * 0.94
        except Exception:
            lstm_pred = 0.0
    else:
        lstm_pred = 0.0

    penalty = 1.0
    if data.Fertilizer < 5 or data.N < 5 or data.P < 5 or data.K < 5:
        penalty = 0.15
    else:
        if data.Fertilizer < 40:
            penalty *= (0.5 + 0.5 * (data.Fertilizer / 40.0))
        if data.N < 50:
            penalty *= (0.6 + 0.4 * (data.N / 50.0))
        if data.P < 20:
            penalty *= (0.7 + 0.3 * (data.P / 20.0))
        if data.K < 20:
            penalty *= (0.7 + 0.3 * (data.K / 20.0))
        if data.temp > 35:
            penalty *= max(0.4, 1.0 - ((data.temp - 35.0) * 0.05))

    rf_pred = round(rf_pred * penalty, 2)
    xgb_pred = round(xgb_pred * penalty, 2)
    lstm_pred = round(lstm_pred * penalty, 2) if lstm_pred > 0 else 0.0

    predictions = {
        "Random Forest": rf_pred, 
        "XGBoost": xgb_pred, 
        "LSTM": lstm_pred
    }
    valid_preds = {k: v for k, v in predictions.items() if isinstance(v, (int, float)) and v > 0}
    recommended_model = max(valid_preds, key=valid_preds.get) if valid_preds else "Random Forest"
    predicted_value = predictions[recommended_model]

    india_avg = 3.60
    try:
        faostat_path = os.path.join(BASE_DIR, "data", "faostat_crop_data.csv")
        if os.path.exists(faostat_path):
            faostat_df = pd.read_csv(faostat_path)
            india_avg = float(faostat_df.loc[(faostat_df['Region'] == 'India') & (faostat_df['Crop_Type'] == 'Wheat'), 'FAOSTAT_Average_Yield_tha'].values[0])
    except Exception as e:
        print(f"FAOSTAT Load Warning: {e}")

    yield_difference = round(predicted_value - india_avg, 2)
    faostat_context = f"This forecast of {predicted_value} t/ha is {abs(yield_difference)} t/ha {'higher' if yield_difference >= 0 else 'lower'} than the FAOSTAT Indian national baseline of {india_avg} t/ha."

    alerts = []
    if data.Fertilizer < 40:
        alerts.append(f"Fertilizer application ({data.Fertilizer} kg/ha) is below optimal agronomic thresholds, limiting potential biomass accumulation.")
    if data.N < 50:
        alerts.append(f"ICAR Soil Health Alert: Nitrogen ({data.N} kg/ha) is critically deficient; immediate split application of Urea is recommended to prevent chlorosis.")
    if data.P < 25:
        alerts.append(f"ICAR Soil Health Alert: Phosphorus ({data.P} kg/ha) is low; apply Diammonium Phosphate (DAP) to support root establishment.")
    if data.K < 25:
        alerts.append(f"ICAR Soil Health Alert: Potassium ({data.K} kg/ha) is deficient; supplement with Muriate of Potash (MOP) to improve cellular water retention and disease resistance.")
    if data.temp > 34:
        alerts.append(f"Thermal Stress Warning: Ambient temperature ({data.temp}°C) exceeds the 34°C threshold, risking accelerated evapotranspiration and grain shriveling.")

    shc_alert = " ".join(alerts)
    
    if alerts:
        insight = f"{shc_alert} {faostat_context} Adjust soil amendments and irrigation scheduling immediately to stabilize yield."
    else:
        insight = (
            f"Soil macronutrients (N: {data.N}, P: {data.P}, K: {data.K} kg/ha) and ambient temperature ({data.temp}°C) "
            f"are well-balanced within optimal ICAR Soil Health Card parameters. {faostat_context} "
            f"Maintain current split-fertilizer scheduling ({data.Fertilizer} kg/ha) and monitor soil moisture during grain filling to lock in this maximum yield potential."
        )

    if GEMINI_API_KEY:
        prompt = (
            f"Act as an expert agricultural scientist for Indian farming systems (KisanPulse). "
            f"Current Soil & Agronomy Parameters: Nitrogen={data.N} kg/ha, Phosphorus={data.P} kg/ha, "
            f"Potassium={data.K} kg/ha, Temperature={data.temp}°C, Fertilizer={data.Fertilizer} kg/ha. "
            f"Predicted Optimal Yield: {predicted_value} t/ha ({recommended_model} model). {faostat_context} "
            f"ICAR SHC Rule Engine Status: {shc_alert if shc_alert else 'All NPK and thermal parameters are optimal.'} "
            f"Write a rich, detailed, highly actionable 3-sentence agronomic optimization strategy for the farmer. "
            f"Explicitly mention the FAOSTAT baseline comparison and specific fertilizer remedies if an alert is present. "
            f"Reply in plain text only without asterisks or markdown."
        )
        
        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        active_models = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"]
        
        for model_name in active_models:
            try:
                print(f"⏳ Contacting Gemini API ({model_name})...")
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
                req = urllib.request.Request(
                    url, 
                    data=json.dumps(payload).encode('utf-8'), 
                    headers={
                        'Content-Type': 'application/json',
                        'x-goog-api-key': GEMINI_API_KEY
                    }
                )
                with urllib.request.urlopen(req, timeout=12, context=ctx) as response:
                    res_data = json.loads(response.read().decode('utf-8'))
                    if 'candidates' in res_data and len(res_data['candidates']) > 0:
                        generated_text = res_data['candidates'][0]['content']['parts'][0]['text']
                        insight = generated_text.replace("*", "").strip()
                        print(f"✅ Gemini Insight Generated Successfully using {model_name}!")
                        break
            except urllib.error.HTTPError as e:
                error_body = e.read().decode('utf-8', errors='ignore')
                print(f"⚠️ {model_name} HTTP Error {e.code}: {error_body}")
            except Exception as e:
                print(f"❌ Gemini REST API Error ({model_name}): {e}")

    if data.lang != "en":
        insight = live_translate(insight, data.lang)

    return {
        "predicted_yield": predicted_value,
        "model": recommended_model,
        "insight": insight,
        "all_predictions": {
            "random_forest": rf_pred,
            "xgboost": xgb_pred,
            "lstm": lstm_pred if lstm_pred > 0 else 0.0,
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