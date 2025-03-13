import React, { useState } from "react";
import "./App.css";
import UserInputForm from "./components/UserInputForm";
import USMap from "./components/USMap";
import axios from "axios";

function App() {
  const [predictionResult, setPredictionResult] = useState(null);
  const handleFormSubmit = async (data) => {
      console.log("User Input Data: ", data)
      const requestData = {
        state_code: data.state_code,
        month: data.month,
        max_temp: data.max_temp,
        min_temp: data.min_temp,
        precipitation: data.precipitation
      };
      
      try {
        const response = await axios.post("http://localhost:8000/predict", requestData, {
          headers: {"Content-Type": "application/json"},
        });
        console.log("Prediction Response", response.data);
        const sortedPrediction = Object.entries(response.data.predictions).sort(([,a],[,b]) => b-a).slice(0,3);
        setPredictionResult(sortedPrediction);
    
      } catch (error) {
        console.log("Error sending data:", error);
      }

  };

  // const [disasterData, setDisasterData] = useState([
  //   { state_code: "CA", disaster_count: 55 },
  //   { state_code: "TX", disaster_count: 40 },
  //   { state_code: "FL", disaster_count: 35 },
  //   { state_code: "NY", disaster_count: 25 },
  //   { state_code: "WA", disaster_count: 15 },
  // ]);

  return (
    <div className = "App">
      <div>
        <h1>Disaster Prediction System</h1>
        <UserInputForm onSubmit = {handleFormSubmit} />
      </div>
      <div>
        <h2>Prediction Result:</h2>
        {predictionResult !== null ? (
          <ul class = "list">
            {predictionResult.map(([disaster, probability], index) => (
              <li key={index}>
                <strong>{disaster}</strong>: {(probability * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        ) : (
          <p>No prediction yet.</p>
        )}
      </div>
      <div>
        <h1>US States Risk Map</h1>
        <USMap></USMap>
      </div>
    </div>
  );
}

export default App;
