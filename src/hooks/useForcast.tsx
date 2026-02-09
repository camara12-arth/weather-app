import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { forecastType, OptionType } from '../types';

/*
  useForcast (hook)
  - Gère l'état et les interactions pour la recherche et la récupération
    des prévisions météo via l'API OpenWeather.
  - Expose `term`, `options`, `city`, `weather`, `loading`, `error`
    ainsi que les handlers `handleInputChange`, `onOptionSelect` et `searchWeather`.
*/
const useForcast = () => {
  const [city,setCity] = useState<OptionType|null>(null);
  const [term,setTerm] = useState('');
  const [weather, setWeather] = useState<forecastType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<Array<OptionType>>([]);
    const timeoutRef = React.useRef<number | null>(null);
  // La clé API est lue depuis les variables d'environnement Vite
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // .env requis

    // Recherche d'options de villes via l'API de géocodage direct
    const getSearOptions = (value: string) => {
      axios
        .get(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`)
        .then((response) => {
          // response.data contient un tableau d'options { name, lat, lon, country, ... }
          setOptions(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.error('Erreur lors de la récupération des options de recherche :', err);
          setOptions([]);
        });
    };
    // Quand l'utilisateur sélectionne une option, on met à jour la ville
    const onOptionSelect = (option: OptionType) => {
      setCity(option);
      console.log(option.name);
    };
    // Gestion de la saisie avec debounce local (600ms)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTerm(value);
      // Annule la sélection précédente lors d'une nouvelle saisie
      setCity(null);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!value.trim()) {
        setOptions([]);
        return;
      }

      // Lance la recherche d'options après un délai pour limiter les requêtes
      timeoutRef.current = window.setTimeout(() => {
        getSearOptions(value.trim());
      }, 600);
    };

    // Quand une ville est choisie, on remplace la saisie par son nom
    useEffect(() => {
      if(city){
        setTerm(city.name);
        setOptions([]);
      }
  }, [city])

    // Nettoyage du timeout au démontage
    useEffect(() => {
        return () => {
          if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, [])

  // Lance la requête de prévision pour la ville sélectionnée
  const searchWeather = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!term.trim()) return;

    setLoading(true);
    setError('');
    try {
      await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${city?.lat}&lon=${city?.lon}&appid=${API_KEY}&units=metric&lang=fr`
      ).then((res) => {
        // Construit un objet forecast simplifié attendu par le composant
        const forecastData = {...res.data.city,list: res.data.list.slice(0, 16)}; // Prendre les 16 premières entrées
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
