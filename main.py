# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

# -------------------------------
# 1. 데이터 불러오기 및 전처리
# -------------------------------
df = pd.read_csv("Dataset_Combined.csv")
df.columns = df.columns.str.lower()  # 모든 컬럼명을 소문자로 변환

print("데이터 샘플:")
print(df.head())
print("\n데이터 정보:")
print(df.info())

# 사용할 피처 설정
numeric_features = ['month', 'maxtemp', 'mintemp', 'precipitation']
categorical_features = ['state']
target = 'incidenttype'

# 만약 CSV에 max_temp, min_temp 컬럼이 있다면 변경
if 'max_temp' in df.columns:
    df = df.rename(columns={'max_temp': 'maxtemp'})
if 'min_temp' in df.columns:
    df = df.rename(columns={'min_temp': 'mintemp'})

# 결측치 제거
df = df.dropna(subset=numeric_features + categorical_features + [target])

# 범주형 피처 처리: One-Hot 인코딩
df_cat = pd.get_dummies(df[categorical_features], prefix='state')
state_dummy_columns = df_cat.columns.tolist()

# 수치형 피처 스케일링
scaler = StandardScaler()
X_numeric = pd.DataFrame(scaler.fit_transform(df[numeric_features]),
                         columns=numeric_features, index=df.index)

# 최종 입력 데이터 구성
X_final = pd.concat([X_numeric, df_cat], axis=1)
X_final = X_final.astype(float)

# 타겟 인코딩
le_incident = LabelEncoder()
y_encoded = le_incident.fit_transform(df[target])
num_classes = len(le_incident.classes_)
print("예측할 incidenttype 클래스:", le_incident.classes_)

# 학습/검증 데이터 분할
X_train, X_test, y_train, y_test = train_test_split(X_final, y_encoded, test_size=0.2, random_state=42)

# -------------------------------
# 2. 모델 생성 및 학습
# -------------------------------
input_dim = X_train.shape[1]
model = Sequential()
model.add(Dense(64, activation='relu', input_dim=input_dim))
model.add(BatchNormalization())
model.add(Dropout(0.3))
model.add(Dense(32, activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.3))
model.add(Dense(num_classes, activation='softmax'))

optimizer = tf.keras.optimizers.Adam(learning_rate=0.0005)
model.compile(optimizer=optimizer,
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
model.summary()

early_stop = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, min_lr=1e-6, verbose=1)

history = model.fit(
    X_train, y_train,
    epochs=30,
    batch_size=16,
    validation_split=0.2,
    callbacks=[early_stop, reduce_lr],
    verbose=1
)

test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"Test accuracy: {test_acc:.4f}")

# -------------------------------
# 3. 예측 함수 정의
# -------------------------------
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
    
    # 컬럼명 변경: 'state_code' -> 'state', 'max_temp' -> 'maxtemp', 'min_temp' -> 'mintemp'
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
    input_final = input_final.reindex(columns=X_train.columns, fill_value=0)
    
    pred_prob = model.predict(input_final)
    incident_probs = {incident: float(prob) for incident, prob in zip(le_incident.classes_, pred_prob[0])}
    return incident_probs

# -------------------------------
# 4. FastAPI 설정 및 엔드포인트 정의
# -------------------------------
app = FastAPI()

# Pydantic 모델: 입력 데이터 스키마
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

# -------------------------------
# 5. 예시: 사용자 입력에 따른 예측 결과 확인
# -------------------------------
# 이 부분은 터미널에서 FastAPI 서버를 실행한 후 /docs URL에서 테스트하거나, curl/Postman을 이용해 호출할 수 있습니다.
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

