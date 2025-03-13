import React, { useState } from "react";

const UserInputForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    state_code: "",
    month: "",
    max_temp: "",
    min_temp: "",
    precipitation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <h2>Disaster Prediction Input</h2>
      <form onSubmit={handleSubmit}>
        <label>
          State Code:
          <input type="text" name="state_code"  value={formData.state_code} onChange={handleChange} required />
        </label>

        <label>
          Month:
          <input type="number" name="month"  value={formData.month} onChange={handleChange} required />
        </label>

        <label>
          Max Temperature:
          <input type="number" name="max_temp"  value={formData.max_temp} onChange={handleChange} required />
        </label>

        <label>
          Min Temperature:
          <input type="number" name="min_temp"  value={formData.min_temp} onChange={handleChange} required />
        </label>

        <label>
          Precipitation:
          <input type="number" step="0.1" name="precipitation" value={formData.precipitation} onChange={handleChange} required />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserInputForm;
