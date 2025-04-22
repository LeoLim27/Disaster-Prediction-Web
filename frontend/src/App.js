import React, { useState } from "react";
import "./App.css";
import UserInputForm from "./components/UserInputForm";
import USMap from "./components/USMap";
import NewsArticles from "./components/NewsArticles";
import axios from "axios";

function App() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [selectedDisaster, setSelectedDisaster] = useState(null);

  const handleFormSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:8000/predict", {
        state_code: data.state_code,
        month: data.month,
        max_temp: data.max_temp,
        min_temp: data.min_temp,
        precipitation: data.precipitation
      });
      
      const sortedPrediction = Object.entries(response.data.predictions)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);
      setPredictionResult(sortedPrediction);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  return (
    <div className="App">
      <div className="header-section">
        <h1>Disaster Prediction System</h1>
        <UserInputForm onSubmit={handleFormSubmit} />
      </div>

      <div className="results-section">
        <h2>Prediction Result:</h2>
        {predictionResult ? (
          <ul className="prediction-list">
            {predictionResult.map(([disaster, probability], index) => (
              <li key={index}>
                <strong>{disaster}</strong>: {(probability * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        ) : <p>No prediction yet.</p>}
      </div>

      <div className="map-section">
        <h1>US States Risk Map</h1>
        <USMap onDisasterSelect={setSelectedDisaster} />
      </div>

      <div className="news-section">
        <NewsArticles disasterType={selectedDisaster} />
      </div>
    </div>
  );
}

export default App;

