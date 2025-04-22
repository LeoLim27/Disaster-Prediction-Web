import React, { useState, useEffect } from "react";
import axios from "axios";

const disasterKeywords = {
  "Fire": "wildfire OR forest fire",
  "Biological": "pandemic OR outbreak",
  "Severe Storm": "tornado OR hail storm",
  "Coastal Storm": "hurricane OR flood",
  "Tropical Cyclones": "tropical cyclone OR typhoon",
  "Temperature Extremes": "heatwave OR coldwave",
  "Seismic Activities": "earthquake OR volcano"
};

const NewsArticles = ({ disasterType }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const query = disasterType
          ? disasterKeywords[disasterType]
          : "natural disaster OR emergency";

        const response = await axios.get(
          "https://newsapi.org/v2/everything",
          {
            params: {
              // 제목(title)에서만 키워드를 검색
              qInTitle: query,
              sortBy: "publishedAt",
              language: "en",
              pageSize: 5,
              apiKey: "45db5833900b46e990258dfaf0074b6f" // 실제 배포 시 .env로 이동
            }
          }
        );

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
      {/* 헤더를 그리드 컨테이너 밖으로 분리 */}
      <h2 className="news-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
        Latest {disasterType || "Disaster"} News
      </h2>
      <div className="news-container">
        {articles.map((article, index) => (
          <div key={index} className="news-card">
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

