import Forecast from './components/Forecast';
import WeatherSearch from './components/weatherSearch';
import useForcast from './hooks/useForcast';

const App: React.FC = () => {
  const {
    term,
    options,
    city,
    isSearching,
    weather,
    loading,
    error,
    setIsSearching,
    handleInputChange,
    onOptionSelect,
    searchWeather
  } = useForcast();
 
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-300 to-purple-400 flex  justify-center p-4">
      {!isSearching && weather ? (
        <Forecast data={weather} callback={setIsSearching}/>
      ) : (
        <WeatherSearch
          term={term}
          options={options}
          city={city}
          loading={loading}
          error={error}
          handleInputChange={handleInputChange}
          onOptionSelect={onOptionSelect}
          searchWeather={searchWeather}
        />
      )}
    </div>
  );
};


export default App;