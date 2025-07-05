import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";
import Blob from "./Blob";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);

  const apiKey = "644a4d59d4b66fe58bde13bf6c759455"; 

  const handleSearch = async (customCity) => {
    const query = customCity || city;
    if (!query) return;

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`
      );
      const weatherData = await weatherResponse.json();

      if (weatherData.cod !== 200) {
        setError(weatherData.message);
        setLoading(false);
        return;
      }

      setWeather(weatherData);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      const dailyData = forecastData.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );
      setForecast(dailyData);

      setHistory((prev) => {
        const newHistory = [query, ...prev.filter((c) => c !== query)];
        return newHistory.slice(0, 5);
      });

    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCoordsSearch = async (lat, lon) => {
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const weatherData = await weatherResponse.json();

      if (weatherData.cod !== 200) {
        setError(weatherData.message);
        setLoading(false);
        return;
      }

      setWeather(weatherData);
      setCity(weatherData.name);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      const dailyData = forecastData.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );
      setForecast(dailyData);

      setHistory((prev) => {
        const newHistory = [weatherData.name, ...prev.filter((c) => c !== weatherData.name)];
        return newHistory.slice(0, 5);
      });

    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleCoordsSearch(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.log("Geolocation denied or failed, fallback to London");
          handleSearch("London");
        }
      );
    } else {
      handleSearch("London");
    }
  }, []);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clear":
        return <WiDaySunny size={64} />;
      case "Clouds":
        return <WiCloud size={64} />;
      case "Rain":
        return <WiRain size={64} />;
      case "Snow":
        return <WiSnow size={64} />;
      case "Thunderstorm":
        return <WiThunderstorm size={64} />;
      case "Fog":
      case "Mist":
        return <WiFog size={64} />;
      default:
        return <WiCloud size={64} />;
    }
  };

  const getBackground = (condition) => {
    switch (condition) {
      case "Clear":
        return "from-yellow-200 via-yellow-400 to-yellow-600";
      case "Clouds":
        return "from-gray-400 via-gray-500 to-gray-700";
      case "Rain":
        return "from-blue-400 via-blue-500 to-blue-700";
      case "Snow":
        return "from-blue-100 via-blue-200 to-blue-400";
      case "Thunderstorm":
        return "from-purple-600 via-purple-800 to-black";
      default:
        return "from-purple-400 via-pink-400 to-pink-600";
    }
  };

  return (
    <div
      className={`relative overflow-hidden min-h-screen ${
        darkMode ? "bg-black text-white" : "text-black"
      } flex flex-col items-center p-6 transition-colors duration-500 ${
        weather
          ? `bg-gradient-to-br ${getBackground(weather.weather[0].main)}`
          : "bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"
      } font-sans`}
    >
      <Blob />

      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-extrabold mb-6 drop-shadow-lg"
      >
        Weather Dashboard 🌦️
      </motion.header>

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col sm:flex-row gap-4 mb-4 w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-3 rounded-xl border-none focus:ring focus:ring-purple-300 shadow-md text-black"
        />
        <button
          onClick={() => handleSearch()}
          className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition shadow-md"
        >
          Search
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-900 transition shadow-md"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </motion.div>

      {history.length > 0 && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap gap-2 mb-8 max-w-md"
        >
          {history.map((c, index) => (
            <button
              key={index}
              onClick={() => handleSearch(c)}
              className="px-3 py-1 bg-white/30 rounded-full text-sm font-medium hover:bg-white/50 transition"
            >
              {c}
            </button>
          ))}
        </motion.div>
      )}

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 animate-pulse font-medium"
        >
          Loading weather...
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-200 mb-4 font-semibold"
        >
          {error}
        </motion.div>
      )}

      {weather && weather.main && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="backdrop-blur-lg bg-white/20 dark:bg-white/10 border border-white/30 rounded-3xl p-8 text-center mb-8 shadow-2xl w-full max-w-md transition hover:scale-105"
        >
          <h2 className="text-3xl font-extrabold mb-2 drop-shadow-md">
            {weather.name}, {weather.sys.country}
          </h2>
          <div className="text-7xl font-black mb-2 drop-shadow-md">
            {Math.round(weather.main.temp)}°C
          </div>
          <div className="text-6xl mb-2">
            {getWeatherIcon(weather.weather[0].main)}
          </div>
          <div className="flex justify-center gap-8 text-lg font-medium">
            <div>💧 {weather.main.humidity}%</div>
            <div>💨 {weather.wind.speed} m/s</div>
          </div>
          <div className="mt-4 text-xl capitalize font-semibold">
            {weather.weather[0].description}
          </div>
        </motion.div>
      )}

      {forecast.length > 0 && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-5 gap-4"
        >
          {forecast.map((day, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="backdrop-blur-lg bg-white/20 dark:bg-white/10 border border-white/30 rounded-2xl p-4 text-center shadow-lg transition"
            >
              <div className="text-lg font-semibold drop-shadow-md">
                {new Date(day.dt_txt).toLocaleDateString(undefined, {
                  weekday: "short",
                })}
              </div>
              <div className="text-4xl">
                {getWeatherIcon(day.weather[0].main)}
              </div>
              <div className="text-xl font-bold">
                {Math.round(day.main.temp)}°C
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default App;
