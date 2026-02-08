import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Ajout d'Axios
import type { OptionType } from '../types'; // Import du type OptionType
interface WeatherData {
  name: string;
  main: { temp: number; humidity: number };
  weather: Array<{ description: string; icon: string }>;
}

const WeatherSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<Array<OptionType>>([]);
    const timeoutRef = React.useRef<number>(null);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // .env requis

    const getSearOptions = (value:string) => {
        axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`).then((response) => {
            setOptions(response.data);
            console.log(options)
            console.log(response.data);
        }).catch((err) => { 
            console.error('Erreur lors de la récupération des options de recherche :', err);
        });
    }
    const onOptionSelect = (option:OptionType) => {
        setQuery(option.name);
        console.log(option.name);
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if(e.target.value.trim()==='') return;
     timeoutRef.current = setTimeout(() => {
        getSearOptions(e.target.value.trim());
        }, 500);
    }

    useEffect(() => {
        return () => {
            if(timeoutRef.current) clearTimeout(timeoutRef.current);
        }
    }, [])
    
  const searchWeather = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric&lang=fr`
      );
      setWeather(response.data);
      console.log(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Ville non trouvée. Essayez un autre nom.');
      } else {
        setError('Erreur API. Vérifiez votre clé ou la connexion.');
      }
    } finally {
      setLoading(false);
    }
  };

  const iconUrl = (icon: string) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-2xl backdrop-blur-sm">
      <form onSubmit={searchWeather} className="mb-6">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={handleInputChange}
            placeholder="Rechercher une ville (ex: Bamako)"
            className="w-full pl-12 pr-6 py-4 text-lg rounded-2xl bg-white/80 backdrop-blur-sm border-0 focus:ring-4 focus:ring-white/50 shadow-xl transition-all duration-300 placeholder:text-gray-500"
          />
          <ul className="absolute left-0 top-full mt-1 w-full  text-cyan-500 bg-white rounded-lg shadow-lg z-10">
          {(options.length!==null)?options.map((option, index) => {
            return (
                <li key={index} className='hover:bg-cyan-500 hover:text-white'><button onClick={()=>onOptionSelect(option)}  >{option.name}</button></li>
                
            )
          }):null}
        </ul>
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3 px-6 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-100 text-center font-medium">
          {error}
        </div>
      )}

      {weather && (
        <div className="text-center space-y-4 p-6 bg-white/20 rounded-2xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white">{weather.name}</h2>
          <img src={iconUrl(weather.weather[0].icon)} alt="Icône météo" className="mx-auto w-24 h-24" />
          <p className="text-4xl font-black text-white">
            {Math.round(weather.main.temp)}°C
          </p>
          <p className="text-lg capitalize text-white/90">{weather.weather[0].description}</p>
          <p className="text-white/70">Humidité: {weather.main.humidity}%</p>
        </div>
      )}
    </div>
  );
};

export default WeatherSearch;
