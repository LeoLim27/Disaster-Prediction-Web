from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# React에서 받을 데이터 모델 정의
class DisasterInput(BaseModel):
    state_code: str
    month: int
    max_temp: float
    min_temp: float
    precipitation: float

@app.get("/api/predict")  # GET 요청을 처리하는 엔드포인트
def read_root():
    return {"message": "FastAPI is running!"}

# API 엔드포인트: React에서 데이터를 받음
@app.post("/api/predict")
async def predict(data: DisasterInput):
    # 받은 데이터를 터미널에 출력
    print("Received Data:", data)

    # 예제: 단순 계산을 통해 예측 점수 생성
    risk_score = round((data.max_temp - data.min_temp) * data.precipitation, 2)

    # 응답 JSON 반환
    return {
        "status": "success",
        "received_data": data,
        "prediction": {"state_code": data.state_code, "risk_score": risk_score}
    }
