import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  // Axios
  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: cityName,
            appid: apiKey,
            units: "metric",
          },
        }
      );

      console.log("API response:", response.data);
      setWeatherData(response.data);
    } catch (err) {
      console.error(err);
      setWeatherData(null);

      if (err.response && err.response.status === 404) {
        setError("City not found. Try another name.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  // search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  let iconUrl = "";
  if (weatherData && weatherData.weather && weatherData.weather[0]) {
    const iconCode = weatherData.weather[0].icon;
    iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  return (
    <div className="app">
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <div className="loading">Loading weather...</div>}
      {error && <div className="error">{error}</div>}

      {weatherData && (
        <div className="weather-card">
          <div className="weather-header">
            <div>
              <div className="city-name">{weatherData.name}</div>
              <div className="country-code">{weatherData.sys?.country}</div>
            </div>

            {iconUrl && <img src={iconUrl} alt="weather icon" />}
          </div>

          <div className="temp">{Math.round(weatherData.main.temp)}°C</div>
          <div className="description">
            {weatherData.weather[0].description}
          </div>

          <div className="details-grid">
            <div>Feels like</div>
            <div>{Math.round(weatherData.main.feels_like)}°C</div>

            <div>Humidity</div>
            <div>{weatherData.main.humidity}%</div>

            <div>Wind</div>
            <div>{weatherData.wind.speed} m/s</div>

            <div>Pressure</div>
            <div>{weatherData.main.pressure} hPa</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
