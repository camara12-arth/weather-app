import Forecast from './components/Forecast';
import WeatherSearch from './components/weatherSearch';
import useForcast from './hooks/useForcast';

const App: React.FC = () => {
  const {
    term,
    options,
    city,
    weather,
    loading,
    error,
    handleInputChange,
    onOptionSelect,
    searchWeather
  } = useForcast();

  return (
    <>
      {weather ? (
        <Forecast data={weather} />
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