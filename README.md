# Disaster-Data-Mapping

uvicorn main:app --reload

Request body

{
    "state_code": "WI",
    "month": "2",
    "max_temp": "23",
    "min_temp": "-18",
    "precipitation": "5.0"
}

Response body
 
{
  "predictions": {
    "Biological": 0.0008647706126794219,
    "Coastal Storm": 0.000016960912034846842,
    "Drought": 0.00009563975618220866,
    "Earthquake": 0.00010164190462091938,
    "Fire": 0.0020252151880413294,
    "Fishing Losses": 0.0000019535289084160468,
    "Flood": 0.1373135894536972,
    "Freezing": 0.0006828377372585237,
    "Hurricane": 0.00004886730312136933,
    "Other": 0.00006718568329233676,
    "Severe Ice Storm": 0.3948219418525696,
    "Severe Storm": 0.1993430256843567,
    "Snowstorm": 0.24489891529083252,
    "Tornado": 0.008369700983166695,
    "Toxic Substances": 0.0000028686959012702573,
    "Tropical Storm": 0.0010013907449319959,
    "Tsunami": 0.000012543662705866154,
    "Volcanic Eruption": 2.540829484587448e-7,
    "Winter Storm": 0.010330676101148129
  }
}
