import { usePokemon } from "./hooks/usePokemon";

// タイプの名前とTailwindの背景色クラスを紐付ける辞書
const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-orange-700",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-sky-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-stone-500",
  ghost: "bg-violet-700",
  dragon: "bg-indigo-600",
  dark: "bg-gray-800",
  steel: "bg-slate-500",
  fairy: "bg-pink-300",
};

function App() {
  const { pokemonData, loading, error, getRandomPokemon } = usePokemon();

  const mainType = pokemonData?.types[0]?.type.name;
  const bgColor = mainType ? typeColors[mainType] : "bg-slate-100";

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-500 ${bgColor}`}
    >
      <h1
        className={`text-4xl font-extrabold mb-8 transition-colors duration-500 ${mainType ? "text-white drop-shadow-md" : "text-slate-800"}`}
      >
        Random Pokémon!
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-80">
        <div className="h-48 flex flex-col items-center justify-center mb-4">
          {error ? (
            <p className="text-red-500 font-bold">Failed to fetch.</p>
          ) : pokemonData ? (
            <div className="animate-fade-in">
              <img
                src={pokemonData.sprites.front_default}
                alt={pokemonData.name}
                className="mx-auto w-32 h-32 object-contain drop-shadow-md transition-opacity duration-500"
              />
              <p className="text-2xl font-bold text-slate-800 capitalize mt-2">
                {pokemonData.name}
              </p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                {mainType}
              </p>
            </div>
          ) : (
            <p className="text-slate-400">Press the button!</p>
          )}
        </div>

        <button
          onClick={getRandomPokemon}
          disabled={loading}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-full transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Searching...
            </>
          ) : (
            "Get Pokémon"
          )}
        </button>
      </div>
    </div>
  );
}

export default App;
