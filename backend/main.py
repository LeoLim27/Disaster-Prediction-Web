from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import pandas as pd
import pickle
import tensorflow as tf
from tensorflow.keras.models import load_model
from fastapi.middleware.cors import CORSMiddleware

# 전처리 객체와 모델을 파일에서 로드
model = load_model("model.h5")
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)
with open("le_incident.pkl", "rb") as f:
    le_incident = pickle.load(f)
with open("state_dummy_columns.pkl", "rb") as f:
    state_dummy_columns = pickle.load(f)

# 사용할 피처 목록 정의 (이 부분은 학습 시 사용했던 것과 동일해야 합니다)
numeric_features = ['month', 'maxtemp', 'mintemp', 'precipitation']
categorical_features = ['state']

# 예측 함수 정의
def predict_incident(user_input: dict) -> dict:
    """
    사용자 입력 예시: 
    {
        "state_code": "WI",
        "month": "2",
        "max_temp": "23",
        "min_temp": "-18",
        "precipitation": "5.0"
    }
    """
    df_input = pd.DataFrame([user_input])
    df_input.columns = [col.lower() for col in df_input.columns]
    
    # 컬럼명 변환: 'state_code' -> 'state', 'max_temp' -> 'maxtemp', 'min_temp' -> 'mintemp'
    if 'state_code' in df_input.columns:
        df_input = df_input.rename(columns={'state_code': 'state'})
    if 'max_temp' in df_input.columns:
        df_input = df_input.rename(columns={'max_temp': 'maxtemp'})
    if 'min_temp' in df_input.columns:
        df_input = df_input.rename(columns={'min_temp': 'mintemp'})
    
    required_cols = numeric_features + ['state']
    missing = [col for col in required_cols if col not in df_input.columns]
    if missing:
        return {"error": f"입력에 필요한 다음 컬럼이 없습니다: {missing}"}
    
    for col in numeric_features:
        df_input[col] = df_input[col].astype(float)
    numeric_scaled = scaler.transform(df_input[numeric_features])
    numeric_scaled_df = pd.DataFrame(numeric_scaled, columns=numeric_features)
    
    df_cat_input = pd.get_dummies(df_input['state'], prefix='state')
    df_cat_input = df_cat_input.reindex(columns=state_dummy_columns, fill_value=0)
    
    input_final = pd.concat([numeric_scaled_df, df_cat_input], axis=1)
    # 학습 시 사용한 컬럼 순서에 맞게 정렬 (필요한 경우)
    # 여기서는 X_final과 동일한 컬럼 순서를 사용한다고 가정합니다.
    
    pred_prob = model.predict(input_final)
    incident_probs = {incident: float(prob) for incident, prob in zip(le_incident.classes_, pred_prob[0])}
    return incident_probs




# FastAPI 설정
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 앱이 실행되는 주소
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용 (POST, GET, PUT, DELETE 등)
    allow_headers=["*"],  # 모든 헤더 허용
)

# Pydantic 모델: 입력 스키마
class IncidentInput(BaseModel):
    state_code: str
    month: str
    max_temp: str
    min_temp: str
    precipitation: str

@app.post("/predict")
def predict_endpoint(input_data: IncidentInput):
    input_dict = input_data.dict()
    predictions = predict_incident(input_dict)
    return {"predictions": predictions}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

