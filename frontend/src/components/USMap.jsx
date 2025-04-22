import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { geoAlbersUsa, geoPath, geoCentroid } from "d3-geo";
import { feature } from "topojson-client";

const disasterColorThemes = {
  "Fire": ["#FF9999", "#FF4D4D", "#FF0000"],
  "Biological": ["#90EE90", "#32CD32", "#006400"],
  "Severe Storm": ["#D3D3D3", "#808080", "#696969"],
  "Coastal Storm": ["#E0FFFF", "#B0E0E6", "#87CEFA"],
  "Tropical Cyclones": ["#D8BFD8", "#8A2BE2", "#800080"],
  "Temperature Extremes": ["#FFD700", "#FFA500", "#FF8C00"],
  "Seismic Activities": ["#FFFFE0", "#FFFF00", "#FFD700"]
};

const stateNameToCode = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
  "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
  "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
  "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
  "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
  "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
  "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
  "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
  "Wisconsin": "WI", "Wyoming": "WY", "District of Columbia": "DC"
};

// 주 코드 -> 주 이름 변환 객체
const stateCodeToName = Object.entries(stateNameToCode).reduce((acc, [name, code]) => {
  acc[code] = name;
  return acc;
}, {});

const DisasterBarChart = ({ data, disasterType }) => {
  const svgRef = useRef();
  const width = 400;
  const height = 500;

  useEffect(() => {
    if (!data || !disasterType) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const sortedData = Object.entries(data)
      .filter(([_, counts]) => counts[disasterType] > 0)
      .map(([stateCode, counts]) => ({
        state: stateCodeToName[stateCode],
        count: counts[disasterType]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.count)])
      .range([0, width - 100]);

    const yScale = d3.scaleBand()
      .domain(sortedData.map(d => d.state))
      .range([0, height - 50])
      .padding(0.1);

    svg.append("g")
      .attr("transform", "translate(80, 20)")
      .selectAll("rect")
      .data(sortedData)
      .join("rect")
        .attr("y", d => yScale(d.state))
        .attr("height", yScale.bandwidth())
        .attr("width", d => xScale(d.count))
        .attr("fill", disasterColorThemes[disasterType][2]);

    svg.append("g")
      .attr("transform", "translate(80, 20)")
      .call(d3.axisTop(xScale));

    svg.append("g")
      .attr("transform", "translate(80, 20)")
      .call(d3.axisLeft(yScale));

  }, [data, disasterType]);

  return <svg ref={svgRef} width={width} height={height} />;
};

const USMap = ({ onDisasterSelect }) => {
  const svgRef = useRef();
  const [geoData, setGeoData] = useState(null);
  const [disasterData, setDisasterData] = useState({});
  const [selectedDisaster, setSelectedDisaster] = useState("Fire");

  const getColorByRisk = useCallback(
    (stateName) => {
      const stateCode = stateNameToCode[stateName];
      const stateData = disasterData[stateCode] || {};
      const count = stateData[selectedDisaster] || 0;

      const colorTheme = disasterColorThemes[selectedDisaster] || ["#f5f5f5"];

      if (count >= 70) return colorTheme[2];
      if (count >= 30) return colorTheme[1];
      if (count > 0) return colorTheme[0];
      return "#f5f5f5";
    },
    [disasterData, selectedDisaster]
  );

  const handleDisasterSelect = (disaster) => {
    setSelectedDisaster(disaster);
    onDisasterSelect(disaster);
  };

  useEffect(() => {
    d3.json("http://localhost:8001/disaster-counts").then((data) => {
      setDisasterData(data);
    });
  }, []);

  useEffect(() => {
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then((topology) => {
      const geoJson = feature(topology, topology.objects.states);
      setGeoData(geoJson);
    });
  }, []);

  useEffect(() => {
    if (!geoData || !disasterData) return;

    const svg = d3.select(svgRef.current);
    const width = 800, height = 500;

    const projection = geoAlbersUsa()
      .translate([width / 2, height / 2])
      .scale(1000);
    const pathGenerator = geoPath().projection(projection);

    svg.selectAll("path")
      .data(geoData.features)
      .join("path")
      .attr("d", pathGenerator)
      .attr("fill", d => getColorByRisk(d.properties.name))
      .attr("stroke", "#333");

    svg.selectAll("text").remove();

    svg.selectAll("text")
      .data(geoData.features)
      .join("text")
      .attr("x", d => {
        const coords = projection(geoCentroid(d));
        return coords ? coords[0] : -999;
      })
      .attr("y", d => {
        const coords = projection(geoCentroid(d));
        return coords ? coords[1] : -999;
      })
      .text(d => {
        const stateName = d.properties.name;
        const stateCode = stateNameToCode[stateName];
        return disasterData[stateCode]?.[selectedDisaster] || "";
      })
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("fill", "black")
      .attr("font-weight", "bold");
  }, [geoData, selectedDisaster, disasterData, getColorByRisk]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "10px" }}>
        {Object.keys(disasterColorThemes).map((disaster) => (
          <button
            key={disaster}
            onClick={() => handleDisasterSelect(disaster)}
            style={{
              margin: "5px",
              padding: "10px",
              cursor: "pointer",
              backgroundColor: selectedDisaster === disaster ? "#444" : "#888",
              color: "white",
              borderRadius: "5px",
              border: "none",
            }}
          >
            {disaster}
          </button>
        ))}
      </div>

      <div style={{ 
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        margin: "20px auto",
        maxWidth: "1200px"
      }}>
        <div>
          <svg ref={svgRef} width={800} height={500} style={{ border: "1px solid black" }} />
        </div>

        <div style={{ 
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginBottom: "15px" }}>
            {selectedDisaster ? `${selectedDisaster} Top States` : "Select Disaster Type"}
          </h3>
          <DisasterBarChart 
            data={disasterData}
            disasterType={selectedDisaster}
          />
        </div>
      </div>
    </div>
  );
};

export default USMap;

