import { usePokemon } from "./hooks/usePokemon";

function App() {
  const { pokemonData, loading, error, getRandomPokemon } = usePokemon();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8">
        Random Pokémon!
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-80">
        <div className="h-48 flex flex-col items-center justify-center mb-4">
          {error ? (
            <p className="text-red-500 font-bold">Failed to fetch.</p> // 英語化
          ) : pokemonData ? (
            <div className="animate-fade-in">
              <img
                src={pokemonData.sprites.front_default}
                alt={pokemonData.name}
                className="mx-auto w-32 h-32 object-contain drop-shadow-md transition-opacity duration-500"
              />
              <p className="text-2xl font-bold text-blue-600 capitalize mt-2">
                {pokemonData.name}
              </p>
            </div>
          ) : (
            <p className="text-slate-400">Press the button!</p> // 英語化
          )}
        </div>

        <button
          onClick={getRandomPokemon}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
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
