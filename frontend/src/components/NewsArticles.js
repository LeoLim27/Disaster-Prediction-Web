import React, { useState, useEffect } from "react";
import axios from "axios";

// 상세 키워드 배열
const FIRE_KEYWORDS = [
  "wildfire", "forest fire", "bushfire", "wild land fire", "grass fire",
  "brush fire", "campfire ban", "burn area", "fire perimeter", "fire containment",
  "evacuation order", "evacuation warning", "red flag warning", "fire risk", "fire hazard",
  "smoke plume", "firestorm", "flames spread", "fire suppression", "acres burned",
  "fire weather", "fireline", "structure threatened", "burn scar", "fire retardant drop"
];

const BIOLOGICAL_KEYWORDS = [
  "virus", "viral outbreak", "pandemic", "epidemic", "epizootic", "infectious disease",
  "contagious disease", "outbreak", "biohazard", "quarantine", "CDC", "WHO", "H5N1",
  "bird flu", "avian flu", "swine flu", "H1N1", "H1N2", "zoonotic", "pathogen",
  "superbug", "public health emergency", "bioterrorism", "biological weapon", "anthrax",
  "ebola", "zika virus", "mosquito-borne illness", "vaccine", "immunization",
  "biological threat", "biological agent", "viral strain", "lab leak", "biosafety level",
  "gain-of-function", "spillover event", "genetic mutation", "outbreak response",
  "epidemiologist", "incubation period", "infection rate", "case fatality rate"
];

const SEVERE_STORM_KEYWORDS = [
  "severe storm", "thunderstorm", "lightning storm", "hailstorm", "tornado",
  "supercell", "derecho", "wind damage", "wind gusts", "tornado warning",
  "tornado watch", "funnel cloud", "EF scale", "storm damage", "straight-line winds",
  "rotating storm", "storm outbreak", "storm chaser", "storm shelter", "flash flooding",
  "severe weather", "storm surge", "storm path", "storm prediction center",
  "mesocyclone", "flood watch", "weather alert", "NOAA", "National Weather Service"
];

const COASTAL_STORM_KEYWORDS = [
  "hurricane", "storm surge", "coastal flood", "high winds", "storm shelter",
  "hurricane season", "tropical storm", "flooding", "storm impact",
  "hurricane warning", "storm surge warning", "storm damage", "storm path",
  "tropical depression", "storm track", "tropical cyclone", "weather alert"
];

const TROPICAL_CYCLONE_KEYWORDS = [
  "tropical cyclone", "hurricane", "typhoon", "tropical depression", "storm surge",
  "tropical storm", "storm track", "storm warning", "cyclone formation",
  "storm damage", "storm path", "hurricane season", "tropical wave"
];

const SEISMIC_ACTIVITY_KEYWORDS = [
  "earthquake", "seismic activity", "seismic wave", "fault line", "tremor",
  "aftershock", "magnitude", "earthquake swarm", "seismic hazard",
  "ground shaking", "seismograph", "tectonic plate", "subduction zone"
];

// 재난 타입별 제목 검색용 쿼리 문자열 생성
const makeQuery = arr => arr
  .map(k => k.includes(' ') ? `"${k}"` : k)
  .join(' OR ');

const titleQueries = {
  Fire: makeQuery(FIRE_KEYWORDS),
  Biological: makeQuery(BIOLOGICAL_KEYWORDS),
  "Severe Storm": makeQuery(SEVERE_STORM_KEYWORDS),
  "Coastal Storm": makeQuery(COASTAL_STORM_KEYWORDS),
  "Tropical Cyclones": makeQuery(TROPICAL_CYCLONE_KEYWORDS),
  "Temperature Extremes": "heatwave OR coldwave",
  "Seismic Activities": makeQuery(SEISMIC_ACTIVITY_KEYWORDS)
};

const NewsArticles = ({ disasterType }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      const params = {
        sortBy: "publishedAt",
        language: "en",
        pageSize: 50,
        apiKey: "45db5833900b46e990258dfaf0074b6f"
      };

      const titleQuery = disasterType ? titleQueries[disasterType] : "disaster";

      try {
        // 제목 기반 검색
        let response = await axios.get("https://newsapi.org/v2/everything", {
          params: { ...params, qInTitle: titleQuery }
        });

        // 제목 검색 결과 없으면 본문 전체 검색으로 fallback
        if (!response.data.articles.length) {
          response = await axios.get("https://newsapi.org/v2/everything", {
            params: { ...params, q: titleQuery }
          });
        }

        setArticles(response.data.articles.slice(0, 5));
      } catch (err) {
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [disasterType]);

  if (loading) return <div className="news-loading">Loading news...</div>;
  if (error) return <div className="news-error">⚠️ {error}</div>;

  return (
    <div className="news-wrapper">
      <h2 className="news-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
        Latest {disasterType || "Disaster"} News
      </h2>
      <div className="news-container">
        {articles.map((article, idx) => (
          <div key={idx} className="news-card">
            {article.urlToImage && (
              <div className="image-container">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="news-image"
                />
              </div>
            )}
            <div className="news-content">
              <h3>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news-title"
                >
                  {article.title}
                </a>
              </h3>
              <p className="news-description">{article.description}</p>
              <div className="news-footer">
                <span className="news-source">{article.source?.name}</span>
                <span className="news-date">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsArticles;

