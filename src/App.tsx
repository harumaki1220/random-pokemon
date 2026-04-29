import { useState, useEffect, useRef } from "react";

interface PokemonData {
  name: string;
  sprites: {
    front_default: string;
  };
}

function App() {
  const [pokemonId, setPokemonId] = useState<number | null>(null);
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const cache = useRef<Record<number, PokemonData>>({});

  useEffect(() => {
    if (pokemonId === null) return;

    if (cache.current[pokemonId]) {
      setPokemonData(cache.current[pokemonId]);
      setError(false);
      return;
    }

    const fetchPokemon = async () => {
      setError(false);
      try {
        setLoading(true);
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
        );

        if (!res.ok) {
          throw new Error(
            `ポケモンが見つかりませんでした (Status: ${res.status})`,
          );
        }

        const data = await res.json();
        setPokemonData(data);
        cache.current[pokemonId] = data;
      } catch (err) {
        setError(true);
        console.error("通信エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonId]);

  const getRandomPokemon = () => {
    // ポケモンの図鑑番号は現在1025まで
    const randomId = Math.floor(Math.random() * 1025) + 1;
    setPokemonId(randomId);
  };

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
