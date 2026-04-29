import { useState, useEffect, useRef } from "react";

export interface PokemonData {
  name: string;
  sprites: {
    front_default: string;
  };
}

const loadCacheFromStorage = (): Record<number, PokemonData> => {
  try {
    const savedCache = localStorage.getItem("pokemonCache");
    return savedCache ? JSON.parse(savedCache) : {};
  } catch (error) {
    console.error("Failed to parse localStorage", error);
    return {};
  }
};

export const usePokemon = () => {
  const [pokemonId, setPokemonId] = useState<number | null>(null);
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const cache = useRef<Record<number, PokemonData>>(loadCacheFromStorage());

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
          throw new Error(`Pokemon not found (Status: ${res.status})`);
        }

        const rawData = await res.json();

        const slimData: PokemonData = {
          name: rawData.name,
          sprites: {
            front_default: rawData.sprites.front_default,
          },
        };

        setPokemonData(slimData);
        cache.current[pokemonId] = slimData;
        localStorage.setItem("pokemonCache", JSON.stringify(cache.current));
      } catch (err) {
        setError(true);
        console.error("Fetch error:", err);
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
