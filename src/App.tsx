import { usePokemon } from "./hooks/usePokemon";

function App() {
  const { pokemonData, loading, error, getRandomPokemon } = usePokemon();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8">
        Random Pokemon!
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        {pokemonData && (
          <div className="mb-4">
            <img
              src={pokemonData.sprites.front_default}
              alt={pokemonData.name}
              className="mx-auto w-32 h-32"
            />
            <p className="text-2xl font-bold text-blue-600 capitalize">
              {pokemonData.name}
            </p>
          </div>
        )}

        {error && (
          <p className="text-red-500 font-bold mb-4">
            ポケモンの取得に失敗しました。もう一度試してください。
          </p>
        )}

        <button
          onClick={getRandomPokemon}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {loading ? "読み込み中..." : "ポケモンを呼ぶ"}
        </button>
      </div>
    </div>
  );
}

export default App;
