import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { forecastType, OptionType } from '../types';
const useForcast = () => {
  const [city,setCity] = useState<OptionType|null>(null);
  const [term,setTerm] = useState('');
  const [weather, setWeather] = useState<forecastType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<Array<OptionType>>([]);
    const timeoutRef = React.useRef<number | null>(null);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // .env requis

    const getSearOptions = (value: string) => {
      axios
        .get(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`)
        .then((response) => {
          setOptions(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.error('Erreur lors de la récupération des options de recherche :', err);
          setOptions([]);
        });
    };
    const onOptionSelect = (option: OptionType) => {
      setCity(option);
      console.log(option.name);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTerm(value);
      setCity(null);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!value.trim()) {
        setOptions([]);
        return;
      }

      timeoutRef.current = window.setTimeout(() => {
        getSearOptions(value.trim());
      }, 600);
    };

    useEffect(() => {
        if(city){
            setTerm(city.name);
            setOptions([]);
        }
}, [city])

    useEffect(() => {
        return () => {
          if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, [])

  const searchWeather = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!term.trim()) return;

    setLoading(true);
    setError('');
    try {
      await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${city?.lat}&lon=${city?.lon}&appid=${API_KEY}&units=metric&lang=fr`
      ).then((res) => {
        const forecastData = {...res.data.city,list: res.data.list.slice(0, 16)}; // Prendre les 8 premières entrées (24h)
        setWeather(forecastData);
        console.log(res.data);
      });
      
      
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

return {
    term,
    options,
    city,
    weather,
    loading,
    error,
    handleInputChange,
    onOptionSelect,
    searchWeather

}
}

export default useForcast;
