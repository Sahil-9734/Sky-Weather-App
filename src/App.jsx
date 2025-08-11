import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye, Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';

const WeatherApp = () => {
  // State management for our app
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // Replace with your actual API key

  // Get weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error('Location not found');
      const data = await response.json();
      setWeather({
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000
      });
    } catch (err) {
      setError('Could not get weather for your location.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Weather icons mapping with improved colors
  const getWeatherIcon = (condition) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return <Sun className="w-20 h-20 text-yellow-400 drop-shadow-xl animate-pulse" />;
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className="w-20 h-20 text-gray-500 drop-shadow-xl" />;
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <CloudRain className="w-20 h-20 text-blue-300 drop-shadow-xl" />;
    } else if (lowerCondition.includes('snow')) {
      return <CloudSnow className="w-20 h-20 text-gray-100 drop-shadow-xl" />;
    } else {
      return <Cloud className="w-20 h-20 text-gray-100 drop-shadow-xl" />;
    }
  };

  // Detect location on app load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setError("Location access denied. Please search manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Fetch weather from OpenWeatherMap
  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('City not found or API error');
      }

      const data = await response.json();

      const weatherData = {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000
      };

      setWeather(weatherData);
    } catch (err) {
      setError('City not found. Please try again with a valid city name.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    fetchWeather();
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  // Demo function for testing
  const loadDemoData = () => {
    setWeather({
      city: 'New York',
      country: 'United States',
      temperature: 22,
      condition: 'Partly Cloudy',
      humidity: 65,
      pressure: 1013,
      windSpeed: 15,
      visibility: 10
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-sky-400 to-sky-600 p-4" style={{fontFamily: "'Roboto', 'Open Sans', sans-serif"}}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-6xl font-black text-white mb-4 drop-shadow-2xl tracking-tight" style={{fontFamily: "'Roboto Slab', 'Georgia', serif"}}>
            SkyWeather
          </h1>
          <p className="text-sky-50 drop-shadow-lg text-xl font-semibold tracking-wide" style={{fontFamily: "'Open Sans', sans-serif"}}>
            Your Personal Weather Companion
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative group">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name..."
              className="w-full px-6 py-4 pr-16 rounded-2xl border-0 shadow-2xl focus:ring-4 focus:ring-sky-200 focus:ring-opacity-60 outline-none text-sky-800 placeholder-sky-500 bg-white bg-opacity-95 backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl font-semibold text-lg"
              style={{fontFamily: "'Open Sans', sans-serif"}}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-6 border border-white border-opacity-30">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
              <span className="ml-4 text-white font-bold text-lg tracking-wide" style={{fontFamily: "'Open Sans', sans-serif"}}>Loading weather data...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-400 bg-opacity-25 backdrop-blur-lg border border-red-200 border-opacity-40 rounded-2xl p-5 mb-6 shadow-xl">
            <p className="text-red-50 text-center font-bold text-lg tracking-wide" style={{fontFamily: "'Open Sans', sans-serif"}}>{error}</p>
          </div>
        )}

        {/* Weather Data Display */}
        {weather && !loading && (
          <div className="bg-white bg-opacity-15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white border-opacity-25 transform transition-all duration-500 hover:scale-105 hover:bg-opacity-20">
            {/* Location */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-sky-100 mr-3 drop-shadow-lg" />
                <h2 className="text-4xl font-black text-black drop-shadow-2xl tracking-tight" style={{fontFamily: "'Roboto Slab', serif"}}>
                  {weather.city}
                </h2>
              </div>
              <p className="text-green font-semibold text-xl drop-shadow tracking-wide" style={{fontFamily: "'Open Sans', sans-serif"}}>
                {weather.country}
              </p>
            </div>

            {/* Main Weather Info */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                {getWeatherIcon(weather.condition)}
              </div>
              <div className="text-8xl font-black text-black mb-4 drop-shadow-2xl tracking-tight" style={{fontFamily: "'Roboto Slab', serif"}}>
                {weather.temperature}°
              </div>
              <div className="text-2xl text-sky-500 drop-shadow-lg font-bold capitalize tracking-wide" style={{fontFamily: "'Open Sans', sans-serif"}}>
                {weather.condition}
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Humidity */}
              <div className="bg-gradient-to-br from-cyan-400 to-cyan-500 bg-opacity-25 rounded-2xl p-5 shadow-lg border border-cyan-200 border-opacity-30 hover:bg-opacity-35 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Droplets className="w-6 h-6 text-cyan-100 mr-3 drop-shadow" />
                  <span className="text-cyan-50 text-sm font-bold tracking-wide" style={{fontFamily: "'Open Sans', sans-serif"}}>Humidity</span>
                </div>
                <div className="text-white text-3xl font-black drop-shadow-lg" style={{fontFamily: "'Roboto Slab', serif"}}>
                  {weather.humidity}%
                </div>
              </div>

              {/* Wind Speed */}
              <div className="bg-gradient-to-br from-teal-400 to-teal-500 bg-opacity-25 rounded-2xl p-5 shadow-lg border border-teal-200 border-opacity-30 hover:bg-opacity-35 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Wind className="w-6 h-6 text-teal-100 mr-3 drop-shadow" />
                  <span className="text-teal-50 text-sm font-bold tracking-wide" style={{fontFamily: "'Open Sans', sans-serif"}}>Wind Speed</span>
                </div>
                <div className="text-white text-3xl font-black drop-shadow-lg" style={{fontFamily: "'Roboto Slab', serif"}}>
                  {weather.windSpeed} km/h
                </div>
              </div>

              {/* Pressure */}
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 bg-opacity-25 rounded-2xl p-5 shadow-lg border border-blue-200 border-opacity-30 hover:bg-opacity-35 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Thermometer className="w-6 h-6 text-blue-100 mr-3 drop-shadow" />
                  <span className="text-blue-50 text-sm font-bold tracking-wide" style={{fontFamily: "'Open Sans', sans-serif"}}>Pressure</span>
                </div>
                <div className="text-white text-3xl font-black drop-shadow-lg" style={{fontFamily: "'Roboto Slab', serif"}}>
                  {weather.pressure} mb
                </div>
              </div>

              {/* Visibility */}
              <div className="bg-gradient-to-br from-indigo-400 to-indigo-500 bg-opacity-25 rounded-2xl p-5 shadow-lg border border-indigo-200 border-opacity-30 hover:bg-opacity-35 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Eye className="w-6 h-6 text-indigo-100 mr-3 drop-shadow" />
                  <span className="text-indigo-50 text-sm font-bold tracking-wide" style={{fontFamily: "'Open Sans', sans-serif"}}>Visibility</span>
                </div>
                <div className="text-white text-3xl font-black drop-shadow-lg" style={{fontFamily: "'Roboto Slab', serif"}}>
                  {weather.visibility} km
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-sky-50 text-base font-semibold opacity-90 tracking-wide" style={{fontFamily: "'Open Sans', sans-serif"}}>
            Crafted with React & Modern Design
          </p>
          <div className="flex justify-center mt-3">
            <div className="w-3 h-3 bg-sky-100 rounded-full mx-1 opacity-70 animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-3 h-3 bg-sky-200 rounded-full mx-1 opacity-70 animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-3 h-3 bg-sky-300 rounded-full mx-1 opacity-70 animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;