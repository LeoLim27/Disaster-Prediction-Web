import React, { useState } from "react";
import "./App.css";
import UserInputForm from "./components/UserInputForm";
import USMap from "./components/USMap";

function App() {
  const handleFormSubmit = (data) => {
    console.log("User Input Data: ", data)
    // Fast api 로 데이터 전송하는 코드 추가예정
  };

  const [disasterData, setDisasterData] = useState([
    { state_code: "CA", disaster_count: 55 },
    { state_code: "TX", disaster_count: 40 },
    { state_code: "FL", disaster_count: 35 },
    { state_code: "NY", disaster_count: 25 },
    { state_code: "WA", disaster_count: 15 },
  ]);

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
