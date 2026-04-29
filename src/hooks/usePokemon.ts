import { useState, useEffect, useRef } from "react";

export interface PokemonData {
  name: string;
  sprites: {
    front_default: string;
  };
}

export const usePokemon = () => {
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
    const randomId = Math.floor(Math.random() * 1025) + 1;
    setPokemonId(randomId);
  };

  return { pokemonData, loading, error, getRandomPokemon };
};
