import axios from 'axios';
import React, { useState, useEffect } from 'react';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    const storedWeather = localStorage.getItem('weather');
    if (storedWeather) {
      setWeather(JSON.parse(storedWeather));
    }
  }, []);

  useEffect(() => {
    if (weather) {
      localStorage.setItem('weather', JSON.stringify(weather));
    }
  }, [weather]);

  const fetchWeather = async (city, country) => {
    if (!city) return;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      alert('City not found');
    }
  };

  const fetchCitySuggestions = async (query) => {
    if (query.length < 3) {
      setCitySuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${API_KEY}&units=metric`
      );
      setCitySuggestions(response.data.list);
    } catch (error) {
      console.log('Error fetching city suggestions:', error);
    }
  };

  const handleCityInputChange = (e) => {
    const input = e.target.value;
    setCity(input);
    fetchCitySuggestions(input);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city, '');
setCitySuggestions([]) // make it clear after you have selected using keyboard or clicked the button search

  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity.name);
    fetchWeather(selectedCity.name, selectedCity.sys.country);
    setCitySuggestions([]);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#3d2c54] to-[#0b0216] p-4">
      <div className="w-full max-w-md bg-[#c2bbbb39] bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg p-6 text-center text-white">
        <h1 className="text-2xl font-semibold">Weather App</h1>
        <form onSubmit={handleFormSubmit} className="flex items-center bg-white bg-opacity-20 p-2 rounded-lg mt-4">
          <input
            type="text"
            className="w-full p-2 bg-transparent outline-none text-white placeholder-white"
            placeholder="Enter city name"
            value={city}
            onChange={handleCityInputChange}
          />
          <button
            id="search-btn"
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            type="submit"
          >
            Search
          </button>
        </form>

        {citySuggestions.length > 0 && (
          <ul className="mt-2 bg-white text-black rounded-lg shadow-lg">
            {citySuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                onClick={() => handleCitySelect(suggestion)}
              >
                {suggestion.name}, {suggestion.sys.country}
              </li>
            ))}
          </ul>
        )}

        {weather && (
          <div className="mt-6">
            <img
              src={`/${weather.weather[0].main}.png`}
              alt="weather icon"
              className="mx-auto"
            />
            <h2 className="text-4xl">{weather.main.temp}°C</h2>
            <p className="text-lg">{weather.name}</p>
            <div className="flex justify-around mt-4">
              <div>
                <p className="text-sm">Humidity</p>
                <p className="text-xl">{weather.main.humidity}%</p>
              </div>
              <div>
                <p className="text-sm">Country</p>
                <p className="text-xl">{weather.sys.country} </p>
              </div>
              <div>
                <p className="text-sm">Description</p>
                <p className="text-xl first-letter:uppercase">{weather.weather[0].description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
