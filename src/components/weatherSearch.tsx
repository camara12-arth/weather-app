
import type { OptionType } from '../types'; // Import du type OptionType

/*
  WeatherSearch
  - Composant de recherche de ville qui affiche un champ de recherche,
    des suggestions (options) et un bouton pour lancer la recherche météo.
  - Reçoit l'état et les callbacks depuis le hook `useForcast`.
*/

type Props = {
term: string;
options: Array<OptionType>;
loading: boolean;
error: string;
city: OptionType | null;
handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
onOptionSelect: (option: OptionType) => void;
searchWeather: (e: React.SubmitEvent) => void;

}

const WeatherSearch: React.FC<Props> = ({term,options,city,loading,error,handleInputChange,onOptionSelect,searchWeather}) => {

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-2xl backdrop-blur-sm">
      <form onSubmit={searchWeather} className="mb-6">
        <div className="relative">
          <input
            type="search"
            // Affiche le nom de la ville sélectionnée sinon la saisie en cours
            value={city ? city.name : term}
            onChange={handleInputChange}
            placeholder="Rechercher une ville (ex: Bamako)"
            className="w-full pl-12 pr-6 py-4 text-lg rounded-2xl bg-white/80 backdrop-blur-sm border-0 focus:ring-4 focus:ring-white/50 shadow-xl transition-all duration-300 placeholder:text-gray-500"
          />
          {/* Liste des suggestions retournées par l'API de géocodage */}
          <ul className="absolute left-0 top-full mt-1 w-full  text-cyan-500 bg-white rounded-lg shadow-lg z-10">
          {options.map((option, index) => {
            // Utilise lat-lon comme clé si disponible, sinon index
            const key = (option as any).lat && (option as any).lon ? `${(option as any).lat}-${(option as any).lon}` : index;
            return (
                <li key={key} className="hover:bg-cyan-500 hover:text-white">
                  {/* Lors du clic, on sélectionne l'option sans soumettre le formulaire */}
                  <button type="button" onClick={() => onOptionSelect(option)}>{option.name}</button>
                </li>
            );
          })}
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
          {/* Texte du bouton adapté au chargement */}
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>

      {error && (
        // Affiche un message d'erreur si la requête a échoué
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-100 text-center font-medium">
          {error}
        </div>
      )}

    </div>
  );
};

export default WeatherSearch;
