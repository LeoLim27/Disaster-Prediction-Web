# Incident Type Prediction using Deep Learning

This project utilizes deep learning techniques to predict incident types based on climate and location-related data. It includes data preprocessing, model training, and a FastAPI-based prediction service.

## Features
- Preprocesses climate-related data and categorical variables.
- Trains a neural network model using TensorFlow.
- Provides predictions based on user input.
- Saves and loads trained models for inference.

## Dataset
The dataset used for this project (`Dataset_Combined.csv`) contains historical climate data and recorded incident types across various states. It includes attributes such as:
- **State**: The location where the incident occurred.
- **Month**: The month in which the incident took place.
- **Max Temperature / Min Temperature**: Recorded temperature extremes.
- **Precipitation**: Amount of recorded precipitation.
- **Incident Type**: The type of incident that occurred (e.g., fire, severe storm, flood).

The dataset has been cleaned, with missing values removed, and categorical variables encoded for model training.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/incident-prediction.git
   cd incident-prediction
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

## Usage
### Training the Model
Run the following command to train the model and save preprocessing objects:
```sh
python train_model.py
```
This script processes the dataset, trains a neural network, and saves the model along with preprocessing files (`scaler.pkl`, `le_incident.pkl`, `state_dummy_columns.pkl`).

### Making Predictions
Start the prediction service:
```sh
python main.py
```
Then, send a POST request with input data:
```json
{
  "state_code": "WI",
  "month": "2",
  "max_temp": "23",
  "min_temp": "-18",
  "precipitation": "5.0"
}
```
The response will contain predicted probabilities for different incident types.

## Dependencies
- Python 3.x
- FastAPI
- Pandas
- TensorFlow
- Scikit-learn
- Uvicorn

## Contributing
Feel free to submit pull requests for improvements. For major changes, please open an issue first.

## License
This project is licensed under the MIT License.

