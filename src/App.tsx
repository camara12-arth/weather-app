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
    <>
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
    </>
  );
};


export default App;