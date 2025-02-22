import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const USMap = ({ disasterData }) => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json")
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  // 색상 매핑 함수 (재난 빈도수에 따라 색상 변경)
  const getColor = (stateCode) => {
    const disasterInfo = disasterData.find((d) => d.state_code === stateCode);
    if (!disasterInfo) return "#cccccc"; // 데이터 없을 경우 회색

    const count = disasterInfo.disaster_count; // 해당 주의 재난 발생 횟수
    return count > 50 ? "#800026"
         : count > 30 ? "#BD0026"
         : count > 20 ? "#E31A1C"
         : count > 10 ? "#FC4E2A"
         : "#FFEDA0"; // 빈도 낮으면 연한 색
  };

  // GeoJSON 스타일 적용
  const style = (feature) => ({
    fillColor: getColor(feature.properties.postal), // 주 코드 기반 색상 결정
    weight: 1,
    opacity: 1,
    color: "black",
    fillOpacity: 0.7
  });

  // 각 주에 팝업 추가
  const onEachFeature = (feature, layer) => {
    const stateCode = feature.properties.postal;
    const disasterInfo = disasterData.find((d) => d.state_code === stateCode);

    let popupContent = `<b>${feature.properties.name}</b><br/>`;
    popupContent += disasterInfo ? `재난 발생 횟수: ${disasterInfo.disaster_count}` : "데이터 없음";

    layer.bindPopup(popupContent);
  };

  return (
    <MapContainer center={[37.8, -96]} zoom={4} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {geoData && <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />}
    </MapContainer>
  );
};

export default USMap;
