import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import {geoCentroid} from "d3-geo";

const USMap = () => {
  const svgRef = useRef();
  const [geoData, setGeoData] = useState(null);
  const [selectedDisaster, setSelectedDisaster] = useState("fire");
  
  // const disasterColors = {
  //   fire: {
  //     "California": "#ff5733", // 캘리포니아 (화재 - 주황)
  //     "Texas": "#ff6f00",
  //     "Wisconsin": "#ff4500",
  //   },
  //   flood: {
  //     "California": "#0067a3", // 캘리포니아 (홍수 - 파랑)
  //     "Texas": "#0067a3",
  //     "Wisconsin": "#0055ff",
  //   },
  //   earthquake: {
  //     "California": "#8b0000", // 캘리포니아 (지진 - 진한 빨강)
  //     "Texas": "#a52a2a",
  //     "WIsconsin": "#ff5733",
  //   },
  // };

  // 리스크 점수 데이터
  const riskScores = {
    fire: { California: 60, Texas: 30, Wisconsin: 60 },
    flood: { California: 60, Texas: 30, Wisconsin: 10 },
    earthquake: { California: 60, Texas: 35, Wisconsin: 60 },
  };

  // 점수에 따른 색상 결정 함수
  const getColorByRisk = (stateCode) => {
    const score = riskScores[selectedDisaster]?.[stateCode] || 0;
    if (score >= 50) return "#ec1717"; // 높은 위험 (빨강)
    if (score >= 30) return "#ff6347"; // 중간 위험 (주황)
    if (score > 0) return "#fbb9ab";  // 낮은 위험 (연한 주황)
    return "#f5f5f5"; // 기본 회색
  };

  // Fire 일때 점수에따른 색상결정함수
  const getColorByRiskFire = (stateCode) => {
    const score = riskScores[selectedDisaster]?.[stateCode] || 0;
    if (score >= 50) return "#ec1717"; // 높은 위험 (빨강)
    if (score >= 30) return "#ff6347"; // 중간 위험 (주황)
    if (score > 0) return "#fbb9ab";  // 낮은 위험 (연한 주황)
    return "#f5f5f5"; // 기본 회색
  };

  useEffect(() => {
    // 미국 지도 데이터 가져오기
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then((topology) => {
      const geoJson = feature(topology, topology.objects.states);
      setGeoData(geoJson);
    });
  }, []);

  useEffect(() => {
    if (!geoData) return;

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
        .attr("fill", d => {
          const stateCode = d.properties?.name;
          console.log("stateCode:", stateCode);
          const stateCodeSplit = stateCode ? stateCode.split("-")[1] : "";
          console.log("stateCode:", stateCodeSplit);
          // get color by risk 함수쓰는중
          return getColorByRisk(stateCode);
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
          .text(d => {
            const stateCode = d.properties?.iso_3166_2?.split("-")[1] || "";
            return riskScores[selectedDisaster]?.[stateCode] || "";
          })
          .attr("text-anchor", "middle")
          .attr("font-size", "16px")
          .attr("fill", "black")
          .attr("font-weight", "bold");
  }, [geoData, selectedDisaster]);

  return (
    <div style={{ textAlign: "center" }}>
      {/* 내비게이션 바 */}
      <div style={{ marginBottom: "10px" }}>
        {["fire", "flood", "earthquake"].map((disaster) => (
          <button
            key={disaster}
            // onClick 이 fire, flood, earthquake 등 일때
            // 맞는 함수 불러와서 색깔입히기 (fire, flood, earthquake일때 색깔 함수 만들어야함)
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
            {disaster.charAt(0).toUpperCase() + disaster.slice(1)}
          </button>
        ))}
      </div>
      <svg ref={svgRef} width={800} height={500} style={{ border: "1px solid black" }} />
    </div>
  );
};

export default USMap;
