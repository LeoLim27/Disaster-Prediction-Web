import React, { useState } from "react";
import "./App.css";
import UserInputForm from "./components/UserInputForm";
import USMap from "./components/USMap";

function App() {
  const handleFormSubmit = async (data) => {
      console.log("User Input Data: ", data)
      const jsonData = JSON.stringify(data);

      try {
          const response = await fetch("http://localhost:8000/api/predict", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: jsonData,
          });

          if (!response.ok) {
              throw new Error("Failed to send data");
          }
          const result = await response.json();
          console.log("Response from API:", result);
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
        <h1>US States Risk Map</h1>
        <USMap></USMap>
      </div>
    </div>
  );
}

export default App;
