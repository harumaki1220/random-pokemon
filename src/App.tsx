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
  const {
    pokemonData,
    loading,
    error,
    getRandomPokemon,
    favorites,
    addFavorite,
    removeFavorite,
  } = usePokemon();

  const mainType = pokemonData?.types[0]?.type.name;
  const bgColor = mainType ? typeColors[mainType] : "bg-slate-100";

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-500 ${bgColor}`}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className={`text-4xl font-extrabold mb-8 text-center transition-colors duration-500 ${mainType ? "text-white drop-shadow-md" : "text-slate-800"}`}
        >
          Poké Collector
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1 sticky top-8">
            <div className="bg-white p-6 rounded-3xl shadow-2xl text-center border-4 border-white">
              <div className="h-48 flex flex-col items-center justify-center mb-4">
                {error ? (
                  <p className="text-red-500 font-bold">Failed to fetch.</p>
                ) : pokemonData ? (
                  <div className="animate-fade-in">
                    <img
                      src={pokemonData.sprites.front_default}
                      alt={pokemonData.name}
                      className="mx-auto w-40 h-40 object-contain drop-shadow-lg"
                    />
                    <p className="text-2xl font-bold text-slate-800 capitalize mt-2">
                      {pokemonData.name}
                    </p>
                    <p className="inline-block px-3 py-1 text-xs font-bold text-white bg-slate-400 rounded-full uppercase tracking-widest mb-4">
                      {mainType}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">
                    Press the button below!
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={getRandomPokemon}
                  disabled={loading}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-2xl transition-all active:scale-95 disabled:bg-slate-300"
                >
                  {loading ? "Searching..." : "Get Random"}
                </button>

                <button
                  onClick={addFavorite}
                  disabled={!pokemonData || loading}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                >
                  Add Favorite
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h2
              className={`text-xl font-bold mb-4 flex items-center gap-2 ${mainType ? "text-white" : "text-slate-800"}`}
            >
              <span>My Collection</span>
              <span className="bg-white text-slate-800 text-xs py-1 px-2 rounded-full">
                {favorites.length}
              </span>
            </h2>

            {favorites.length === 0 ? (
              <div className="bg-white/30 backdrop-blur-sm border-2 border-dashed border-white/50 rounded-3xl p-12 text-center">
                <p className="text-white font-medium">
                  No Pokémon in your collection yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {favorites.map((fav) => (
                  <div
                    key={fav.name}
                    className="bg-white p-4 rounded-2xl shadow-md group relative hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={fav.sprites.front_default}
                      alt={fav.name}
                      className="w-20 h-20 mx-auto"
                    />
                    <p className="text-center font-bold text-slate-700 capitalize text-sm truncate">
                      {fav.name}
                    </p>

                    <button
                      onClick={() => removeFavorite(fav.name)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
