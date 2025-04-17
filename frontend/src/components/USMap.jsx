import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { geoAlbersUsa, geoPath, geoCentroid } from "d3-geo";
import { feature } from "topojson-client";



const disasterColorThemes = {
  "Fire" : ["#FF9999", "#FF4D4D", "#FF0000"],
  "Flood" : ["#ADD8E6", "#1E90FF", "#0000FF"],
  "Biological" : ["#90EE90", "#32CD32", "#006400"],
  "Severe Storm" : ["#D3D3D3", "#808080", "#696969"],
  "Coastal Storm" : ["#E0FFFF", "#B0E0E6", "#87CEFA"],
  "Tropical Cyclones" : ["#D8BFD8", "#8A2BE2", "#800080"],
  "Temperature Extremes": ["#FFD700", "#FFA500", "#FF8C00"],
  "Seismic Activities": ["#FFFFE0", "#FFFF00", "#FFD700"],
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

const USMap = () => {
  const svgRef = useRef();
  const [geoData, setGeoData] = useState(null);
  const [disasterData, setDisasterData] = useState({});
  const [selectedDisaster, setSelectedDisaster] = useState("fire");


  // 색상 결정 함수
  const getColorByRisk = useCallback(
    (stateName) => {
      const stateCode = stateNameToCode[stateName];
      const stateData = disasterData[stateCode] || {};
      const count = stateData[selectedDisaster] || 0;

      const colorTheme = disasterColorThemes[selectedDisaster] || ["#f5f5f5"];

      if (count >= 70) return colorTheme[2];
      if (count >= 30) return colorTheme[1];
      if (count > 0) return colorTheme[0];
      else return "#f5f5f5"; // 회색
    },
    [disasterData, selectedDisaster]
  );

  useEffect(() => {
    // 백엔드 API로부터 재난 데이터 로딩
    d3.json("http://localhost:8001/disaster-counts").then((data) => {
      setDisasterData(data);
    });
  }, []);

  useEffect(() => {
    // 미국 지도 데이터 가져오기
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then((topology) => {
      const geoJson = feature(topology, topology.objects.states);
      setGeoData(geoJson);
    });
  }, []);

  useEffect(() => {
    if (!geoData || !disasterData) return;

    const svg = d3.select(svgRef.current);
    const width = 800, height = 500;

    // 미국 지도 투영법 설정
    const projection = geoAlbersUsa().translate([width / 2, height / 2]).scale(1000);
    const pathGenerator = geoPath().projection(projection);

    // 지도 렌더링
    svg.selectAll("path")
        .data(geoData.features)
        .join("path")
        .attr("d", pathGenerator)
        // .attr("fill", d => {
        //   const stateCode = d.properties?.name;
        //   console.log("stateCode:", stateCode);
        //   const stateCodeSplit = stateCode ? stateCode.split("-")[1] : "";
        //   console.log("stateCode:", stateCodeSplit);
        //   // get color by risk 함수쓰는중
        //   return getColorByRisk(stateCode);
        // })
        .attr("fill", d => {
          const stateName = d.properties.name; // 예: "New Mexico"
          return getColorByRisk(stateName);
        })
        .attr("stroke", "#333")
        
        svg.selectAll("text").remove();

        svg.selectAll("text")
          .data(geoData.features)
          .join("text")
          .attr("x", d => {
            const centroid = geoCentroid(d);
            return projection(centroid)?.[0] || 0;
          })
          .attr("y", d => {
            const centroid = geoCentroid(d);
            return projection(centroid)?.[1] || 0;
          })
          .text((d) => {
            const stateName = d.properties.name;
            const count = disasterData[stateName]?.[selectedDisaster] || 0;
            return count > 0 ? count : "";
          })
          .attr("text-anchor", "middle")
          .attr("font-size", "16px")
          .attr("fill", "black")
          .attr("font-weight", "bold");
  }, [geoData, selectedDisaster]);

  return (
    <div style={{ textAlign: "center" }}>
      {/* 네비게이션 버튼 */}
      <div style={{ marginBottom: "10px" }}>
        {Object.keys(disasterColorThemes).map((disaster) => (
          <button
            key={disaster}
            onClick={() => setSelectedDisaster(disaster)}
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
      <svg ref={svgRef} width={800} height={500} style={{ border: "1px solid black" }} />
    </div>
  );
};

export default USMap;
