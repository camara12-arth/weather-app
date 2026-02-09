import React, { useState, useEffect, useCallback } from 'react';

// ======================================
// INTERFACE TYPES
// ======================================
interface WeatherData {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    pressure_msl: number;
    visibility: number;
    weather_code: number;
  };
  cityName: string;
  country?: string;
}

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

// ======================================
// COMPOSANT PRINCIPAL
// ======================================
const WeatherDashboard: React.FC = () => {
  // États du composant
  const [ville, setVille] = useState<string>('Bamako');
  const [weatherState, setWeatherState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null
  });

  // ======================================
  // API CALL - RÉCUPÉRATION MÉTÉO
  // ======================================
  const fetchMeteo = useCallback(async (search: string): Promise<void> => {
    setWeatherState({ data: null, loading: true, error: null });
    
    try {
      // 1️⃣ GÉOCODAGE Open-Meteo (trouve coordonnées ville)
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(search)}&count=1&language=fr&format=json`
      );
      
      const geoData = await geoResponse.json();
      
      if (!geoData.results?.[0]) {
        throw new Error('Ville non trouvée');
      }

      const { latitude: lat, longitude: lon, name, country } = geoData.results[0];
      
      // 2️⃣ MÉTÉO Open-Meteo (données temps réel)
      const meteoResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,pressure_msl,visibility,weather_code&timezone=auto&forecast_days=1`
      );
      
      const meteoData = await meteoResponse.json();
      
      setWeatherState({ 
        data: { 
          ...meteoData, 
          cityName: name, 
          country 
        }, 
        loading: false, 
        error: null 
      });
    } catch {
      setWeatherState({ 
        data: null, 
        loading: false, 
        error: 'Ville non trouvée. Essayez Paris, Tokyo, Bamako, Dakar...' 
      });
    }
  }, []);

  // Chargement initial Bamako
  useEffect(() => {
    fetchMeteo('Bamako');
  }, [fetchMeteo]);

  // ======================================
  // FONCTIONS UTILITAIRES MÉTÉO
  // ======================================
  const getWeatherIcon = (code: number): string => {
    const icons: Record<number, string> = {
      0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
      45: '🌫️', 48: '🌫️', 61: '🌦️', 63: '☔',
      65: '🌧️', 80: '🌦️', 81: '🌧️', 82: '🌩️', 95: '⛈️'
    };
    return icons[code] || '🌤️';
  };

  const getWeatherText = (code: number): string => ({
    0: 'Ciel clair', 1: 'Peu nuageux', 2: 'Nuageux',
    3: 'Couvert', 45: 'Brouillard', 61: 'Pluie légère',
    63: 'Pluie', 65: 'Fortes pluies', 80: 'Averses', 95: 'Orage'
  }[code] || 'Météo');

  // ======================================
  // COMPOSANT CHAMP DE RECHERCHE
  // ======================================
  const SearchInput = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <input
        type="text"
        value={ville}
        onChange={(e) => setVille(e.target.value)}
        placeholder="Paris, Tokyo, New York, Bamako, Dakar..."
        className="flex-1 px-6 py-4 rounded-3xl bg-white/20 backdrop-blur-xl text-white placeholder-white/80 
                   focus:outline-none focus:ring-4 ring-white/30 transition-all text-lg font-medium
                   border border-white/20 hover:border-white/40 shadow-lg"
        onKeyDown={(e) => e.key === 'Enter' && fetchMeteo(ville)}
      />
      <button
        onClick={() => fetchMeteo(ville)}
        disabled={weatherState.loading}
        className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white 
                   rounded-3xl font-bold text-lg hover:from-emerald-600 hover:to-cyan-600
                   focus:outline-none focus:ring-4 ring-white/50 shadow-xl hover:shadow-2xl 
                   transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                   whitespace-nowrap backdrop-blur-sm border border-white/20"
      >
        {weatherState.loading ? '🔄' : 'Rechercher'}
      </button>
    </div>
  );

  // ======================================
  // COMPOSANT CARTE MÉTÉO PRINCIPALE
  // ======================================
  const WeatherCard = ({ data }: { data: WeatherData }) => (
    <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl 
                    border border-white/20 hover:border-white/30 transition-all duration-300">
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r 
                      from-white to-cyan-100 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
          {data.cityName}
          {data.country && <span className="text-2xl font-normal">, {data.country}</span>}
        </h1>
        <p className="text-xl text-white/90 backdrop-blur-sm bg-black/10 px-4 py-2 rounded-2xl inline-block">
          {new Date(data.current.time).toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
            hour: '2-digit', minute: '2-digit'
          })}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 🟢 TEMPERATURE PRINCIPALE */}
        <div className="text-center group">
          <div className="text-7xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl group-hover:scale-105 transition-transform">
            {Math.round(data.current.temperature_2m)}°
          </div>
          <div className="text-2xl font-semibold text-white/90 mb-8 p-4 bg-white/10 rounded-2xl backdrop-blur-sm inline-block">
            {getWeatherText(data.current.weather_code)}
          </div>
          <div className="w-28 h-28 mx-auto bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-400 
                         rounded-full flex items-center justify-center shadow-2xl text-4xl group-hover:scale-110 transition-all">
            {getWeatherIcon(data.current.weather_code)}
          </div>
        </div>

        {/* 🔵 MÉTRIQUES DÉTAILLÉES */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'Humidité', value: `${data.current.relative_humidity_2m}%`, icon: '💧' },
            { label: 'Vent', value: `${data.current.wind_speed_10m.toFixed(1)} km/h`, icon: '💨' },
            { label: 'Pression', value: `${Math.round(data.current.pressure_msl)} hPa`, icon: '📊' },
            { 
              label: 'Visibilité', 
              value: `${(data.current.visibility / 1000).toFixed(1)} km`,
              icon: '👁️' 
            }
          ].map(({ label, value, icon }, i) => (
            <div key={i} className="group p-6 bg-white/5 rounded-2xl backdrop-blur-xl border border-white/10
                                   hover:bg-white/15 hover:border-white/30 hover:shadow-xl transition-all cursor-pointer">
              <div className="text-3xl mb-2 opacity-75 group-hover:opacity-100 transition-opacity">{icon}</div>
              <div className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">
                {value}
              </div>
              <div className="text-sm text-white/70 mt-1 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ======================================
  // COMPOSANT SPINNER DE CHARGEMENT
  // ======================================
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 border-4 border-white/20 border-t-emerald-400 rounded-full animate-spin mb-6 shadow-xl"></div>
      <div className="text-2xl font-bold text-white/90 animate-pulse">Chargement de la météo</div>
    </div>
  );

  // ======================================
  // COMPOSANT MESSAGE D'ERREUR
  // ======================================
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="bg-gradient-to-r from-rose-500/20 to-red-500/20 border-2 border-rose-500/40
                    backdrop-blur-xl rounded-3xl p-10 text-center text-rose-100 shadow-2xl">
      <div className="text-4xl mb-4">⚠️</div>
      <div className="text-xl font-semibold mb-2">{message}</div>
      <div className="text-rose-200 text-lg">Essayez: Paris, Tokyo, New York, Bamako, Dakar...</div>
    </div>
  );

  // ======================================
  // RENDU PRINCIPAL (JSX)
  // ======================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* 📱 HEADER PRINCIPAL */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-cyan-50 to-emerald-100 
                        bg-clip-text text-transparent mb-6 drop-shadow-2xl leading-tight">
            Météo Mondiale
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto backdrop-blur-sm 
                       bg-white/5 px-8 py-4 rounded-3xl border border-white/10 shadow-lg">
            Météo en temps réel pour toutes les villes du monde 🌍
          </p>
        </div>

        {/* 🎨 CONTENU PRINCIPAL */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-4xl p-10 md:p-14 border border-white/10 shadow-2xl 
                       hover:shadow-3xl transition-all duration-500">
          
          <SearchInput />

          {weatherState.error && <ErrorMessage message={weatherState.error} />}
          {weatherState.loading && <LoadingSpinner />}
          {weatherState.data && <WeatherCard data={weatherState.data} />}
        </div>

        {/* 📋 FOOTER */}
        <div className="mt-16 text-center">
          <p className="text-white/60 text-lg backdrop-blur-sm bg-black/10 px-6 py-3 rounded-2xl inline-block border border-white/10">
            Powered by Open-Meteo API • 100% gratuit • Temps réel
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
