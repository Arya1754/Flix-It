import React, { useState } from 'react';
import axios from 'axios';

const RecommendMovies = () => {
  const [movieName, setMovieName] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const getRecommendations = async () => {
    try {
      const response = await axios.post('https://flix-it.onrender.com/api/recommend', { movie_name: movieName });
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <div className="recommend-container">
      <h1 className="recommend-heading">Your next Favourite Movie</h1>
      <input
        type="text"
        value={movieName}
        onChange={(e) => setMovieName(e.target.value)}
        placeholder="Enter your favourit movie..."
        className="recommend-input"
      />
      <button onClick={getRecommendations} className="recommend-button">Get Recommendations</button>
      {recommendations.length > 0 && (
        <ul className="recommend-list">
          {recommendations.map((rec) => (
            <li key={rec.rank} className="recommend-item">{rec.rank}. {rec.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecommendMovies;
