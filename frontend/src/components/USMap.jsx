import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const USMap = () => {
  const svgRef = useRef();
  const [geoData, setGeoData] = useState(null);

  // 주별 색상 설정 (예제)
  const stateColors = {
    CA: "#ff0000", // 캘리포니아 (빨강)
    TX: "#00ff00", // 텍사스 (초록)
    NY: "#0000ff", // 뉴욕 (파랑)
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
          const stateCode = d.properties.iso_3166_2?.split("-")[1]; // 주 코드
          return stateColors[stateCode] || "#cccccc"; // 기본 회색
        })
        .attr("stroke", "#333")
        .on("mouseover", function (event, d) {
          d3.select(this).attr("fill", "#ffd700"); // 호버 효과 (노란색)
        })
        .on("mouseout", function (event, d) {
          const stateCode = d.properties.iso_3166_2?.split("-")[1];
          d3.select(this).attr("fill", stateColors[stateCode] || "#cccccc");
        });

  }, [geoData]);

  return (
      <svg ref={svgRef} width={800} height={500} style={{ border: "1px solid black" }} />
  );
};

export default USMap;
