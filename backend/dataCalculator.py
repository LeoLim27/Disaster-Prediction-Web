import csv
from collections import defaultdict

category_mapping = {
    "Severe Storm": {"Severe Storm", "Severe Ice Storm", "Snowstorm", "Tornado", "Winter Storm"},
    "Coastal Storm": {"Coastal Storm", "Flood", "Tsunami"},
    "Temperature Extremes": {"Drought", "Freezing"},
    "Seismic Activities": {"Earthquake", "Volcanic Eruption"},
    "Tropical Cyclones": {"Hurricane", "Tropical Storm"},
    "Fire": {"Fire"},
    "Biological": {"Biological", "Toxic Substances"},
}


# 재난 이름 -> 범주 이름으로 역매핑
disaster_to_category = {}
for category, disasters in category_mapping.items():
    for disaster in disasters:
        disaster_to_category[disaster] = category

# 주별 재난 범주 발생 횟수 집계
state_disaster_counts = defaultdict(lambda: defaultdict(int))

with open('/Users/user/Desktop/disaster-prediction-project/backend/Dataset_Combined.csv', newline='', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        if not row or len(row) < 4:
            continue
        state_code = row[1]  # 두 번째 컬럼: 주 코드
        disaster_type = row[3]  # 네 번째 컬럼: 재난 종류

        # 재난 종류를 범주로 매핑
        category = disaster_to_category.get(disaster_type.strip())
        if category:
            state_disaster_counts[state_code][category] += 1

# 결과 확인용 코드
# for state, category_counts in state_disaster_counts.items():
#     print(f"{state}:")
#     for category, count in category_counts.items():
#         print(f"  {category}: {count}")

# FAST API
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict
import csv

app = FastAPI()

# CORS 설정 (프론트와 연동 위해)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 필요시 도메인 제한 가능
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 재난 카테고리 매핑
category_mapping = {
    "Severe Storm": {"Severe Storm", "Severe Ice Storm", "Snowstorm", "Tornado", "Winter Storm"},
    "Coastal Storm": {"Coastal Storm", "Flood", "Tsunami"},
    "Temperature Extremes": {"Drought", "Freezing"},
    "Seismic Activity": {"Earthquake", "Volcanic Eruption"},
    "Tropical Cyclones": {"Hurricane", "Tropical Storm"},
    "Fire": {"Fire"},
    "Biological": {"Biological", "Toxic Substances"},
    "Fishing Losses": {"Fishing Losses"},
    "Other": {"Other"}
}

disaster_to_category = {
    disaster: category for category, disasters in category_mapping.items() for disaster in disasters
}

def parse_disaster_data(csv_path: str):
    state_disaster_counts = defaultdict(lambda: defaultdict(int))
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            if not row or len(row) < 4:
                continue
            state_code = row[1].strip()
            disaster_type = row[3].strip()
            category = disaster_to_category.get(disaster_type)
            if category:
                state_disaster_counts[state_code][category] += 1
    return state_disaster_counts

csv_path = "/Users/user/Desktop/disaster-prediction-project/backend/Dataset_Combined.csv"

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/disaster-counts")
def get_disaster_counts():
    result = parse_disaster_data(csv_path)
    return result
