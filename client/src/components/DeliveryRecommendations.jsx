import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/context.jsx';
import './DeliveryRecommendations.css';

function DeliveryRecommendations() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/recommendations/${user.uid}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (hour) => {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour > 12) return `${hour - 12}:00 PM`;
    return `${hour}:00 AM`;
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'best': return '⭐';
      case 'avoid': return '⚠️';
      default: return '📊';
    }
  };

  if (!user) {
    return (
      <div className="recommendations-container">
        <div className="auth-message">
          Please log in to see your delivery recommendations.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing your delivery data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-container">
        <div className="error-message">
          <h3>Error loading recommendations</h3>
          <p>{error}</p>
          <button onClick={fetchRecommendations} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!recommendations || !recommendations.recommendations) {
    return (
      <div className="recommendations-container">
        <div className="no-data">
          <h3>No Data Available</h3>
          <p>Start adding deliveries to get personalized recommendations!</p>
        </div>
      </div>
    );
  }

  const { recommendations: recs, totalDeliveries, stats } = recommendations;

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h2>🚀 Smart Delivery Recommendations</h2>
        <p>Based on {totalDeliveries} deliveries</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p className="stat-value">${stats.totalEarnings?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="stat-card">
          <h3>Average Tip</h3>
          <p className="stat-value">${stats.avgTip?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="stat-card">
          <h3>Best Hour</h3>
          <p className="stat-value">{stats.bestHour !== undefined ? formatTime(stats.bestHour) : 'N/A'}</p>
        </div>
        <div className="stat-card">
          <h3>Best Day</h3>
          <p className="stat-value">{stats.bestDay || 'N/A'}</p>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="recommendations-grid">
        {/* Best Times */}
        <div className="recommendation-section">
          <h3>{getRecommendationIcon('best')} Best Times to Work</h3>
          <div className="recommendation-list">
            {recs.bestTimes?.map((time, index) => (
              <div key={index} className="recommendation-item best">
                <div className="recommendation-header">
                  <span className="time">{formatTime(time.hour)}</span>
                  <span className="tip">${time.avgTip.toFixed(2)} avg tip</span>
                </div>
                <p className="recommendation-text">{time.recommendation}</p>
                <small>{time.count} deliveries</small>
              </div>
            ))}
          </div>
        </div>

        {/* Best Areas */}
        <div className="recommendation-section">
          <h3>{getRecommendationIcon('best')} Most Profitable Areas</h3>
          <div className="recommendation-list">
            {recs.bestAreas?.map((area, index) => (
              <div key={index} className="recommendation-item best">
                <div className="recommendation-header">
                  <span className="area">{area.area}</span>
                  <span className="tip">${area.avgTip.toFixed(2)} avg tip</span>
                </div>
                <p className="recommendation-text">{area.recommendation}</p>
                <small>{area.count} deliveries</small>
              </div>
            ))}
          </div>
        </div>

        {/* Avoid Times */}
        <div className="recommendation-section">
          <h3>{getRecommendationIcon('avoid')} Times to Avoid</h3>
          <div className="recommendation-list">
            {recs.avoidTimes?.map((time, index) => (
              <div key={index} className="recommendation-item avoid">
                <div className="recommendation-header">
                  <span className="time">{formatTime(time.hour)}</span>
                  <span className="tip">${time.avgTip.toFixed(2)} avg tip</span>
                </div>
                <p className="recommendation-text">{time.recommendation}</p>
                <small>{time.count} deliveries</small>
              </div>
            ))}
          </div>
        </div>

        {/* Avoid Areas */}
        <div className="recommendation-section">
          <h3>{getRecommendationIcon('avoid')} Areas to Avoid</h3>
          <div className="recommendation-list">
            {recs.avoidAreas?.map((area, index) => (
              <div key={index} className="recommendation-item avoid">
                <div className="recommendation-header">
                  <span className="area">{area.area}</span>
                  <span className="tip">${area.avgTip.toFixed(2)} avg tip</span>
                </div>
                <p className="recommendation-text">{area.recommendation}</p>
                <small>{area.count} deliveries</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      {recs.insights && recs.insights.length > 0 && (
        <div className="insights-section">
          <h3>💡 Key Insights</h3>
          <div className="insights-list">
            {recs.insights.map((insight, index) => (
              <div key={index} className="insight-item">
                <p>{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="refresh-section">
        <button onClick={fetchRecommendations} className="refresh-btn">
          🔄 Refresh Recommendations
        </button>
      </div>
    </div>
  );
}

export default DeliveryRecommendations; 