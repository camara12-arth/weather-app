import Degree from './Degree'
import Sunrise from './Icons/Sunrise'
import Sunset from './Icons/Sunset'
import Tile from './Tile'

/*
  Forecast
  - Présente les informations météo récupérées (prévisions) pour la ville sélectionnée.
  - Affiche la météo actuelle (premier élément de la liste), un bandeau horaire
    déroulant et plusieurs tuiles d'informations (vent, humidité, pression, etc.).
*/

import {
  getHumidityValue,
  getWindDirection,
  getVisibilityValue,
  getSunTime,
  getPop,
} from './../helpers'

import type { forecastType } from '../types'

type Props = {
  data: forecastType;
  callback: (value: boolean) => void; // Callback pour gérer l'état de recherche dans App
}

const Forecast = ({ data,callback }: Props) => {
  // La première entrée de la liste représente le point de référence actuel
  const today = data.list[0]

  return (
    <div className="w-full md:max-w-full py-4 md:py-4 md:px-10 lg:px-24 h-full lg:h-auto bg-cyan-400  backdrop-blur-md rounded drop-shadow-lg">
      <div className="mx-auto w-[90%] md:w-[90%] md:p-4 lg:w-[90%] xl:w-[90%] 2xl:w-[50%]  p-6 bg-gradient-to-br from-white/80 to-white/60 rounded-2xl shadow-2xl backdrop-blur-sm">
        {/* En-tête principal : nom de la ville, température et intervalle */}
        <section className="text-center">
          <h2 className="text-2xl font-black">
            {data.name} <span className="font-thin">{data.country}</span>
          </h2>
          <h1 className="text-4xl font-extrabold">
            <Degree temp={Math.round(today.main.temp)} />
          </h1>
          <p className="text-sm">
            {today.weather[0].main} ({today.weather[0].description})
          </p>
          <p className="text-sm">
            H: <Degree temp={Math.ceil(today.main.temp_max)} /> L:{' '}
            <Degree temp={Math.floor(today.main.temp_min)} />
          </p>
        </section>

        {/* Bandeau horizontal affichant les températures par tranche horaire */}
        <section className="flex overflow-x-scroll mt-4 pb-2 mb-5">
          {data.list.map((item, i) => (
            <div
              key={i}
              className="inline-block text-center w-[50px] flex-shrink-0"
            >
              <p className="text-sm">
                {i === 0 ? 'Now' : new Date(item.dt * 1000).getHours()}
              </p>
              <img
                alt={`weather-icon-${item.weather[0].description}`}
                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              />
              <p className="text-sm font-bold">
                <Degree temp={Math.round(item.main.temp)} />
              </p>
            </div>
          ))}
        </section>

        {/* Section de tuiles : lever/coucher du soleil et métriques détaillées */}
        <section className="flex flex-wrap justify-between text-zinc-700 ">
          <div className="w-[140px] text-xs font-bold flex flex-col items-center bg-white/20 backdrop-blur-ls rounded drop-shadow-lg py-4 mb-5">
            <Sunrise /> <span className="mt-2">{getSunTime(data.sunrise)}</span>
          </div>
          <div className="w-[140px] text-xs font-bold flex flex-col items-center bg-white/20 backdrop-blur-ls rounded drop-shadow-lg py-4 mb-5">
            <Sunset /> <span className="mt-2">{getSunTime(data.sunset)}</span>
          </div>

          <Tile
            icon="wind"
            title="Wind"
            info={`${Math.round(today.wind.speed)} km/h`}
            description={`${getWindDirection(
              Math.round(today.wind.deg)
            )}, gusts 
            ${today.wind.gust.toFixed(1)} km/h`}
          />
          <Tile
            icon="feels"
            title="Feels like"
            info={<Degree temp={Math.round(today.main.feels_like)} />}
            description={`Feels ${
              Math.round(today.main.feels_like) < Math.round(today.main.temp)
                ? 'colder'
                : 'warmer'
            }`}
          />
          <Tile
            icon="humidity"
            title="Humidity"
            info={`${today.main.humidity} %`}
            description={getHumidityValue(today.main.humidity)}
          />
          <Tile
            icon="pop"
            title="Precipitation"
            info={`${Math.round(today.pop * 100)}%`}
            description={`${getPop(today.pop)}, clouds at ${today.clouds.all}%`}
          />
          <Tile
            icon="pressure"
            title="Pressure"
            info={`${today.main.pressure} hPa`}
            description={` ${
              Math.round(today.main.pressure) < 1013 ? 'Lower' : 'Higher'
            } than standard`}
          />
          <Tile
            icon="visibility"
            title="Visibility"
            info={`${(today.visibility / 1000).toFixed()} km`}
            description={getVisibilityValue(today.visibility)}
          />
        </section>
        {/* Bouton pour revenir à la recherche */}
        <button
          onClick={() => callback(true)} className='bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg p-1 hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-500 transition duration-300 ease-out'>Search</button>
      </div>
    </div>
  )
}

export default Forecast