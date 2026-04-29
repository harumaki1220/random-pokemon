import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, expect, test, afterEach } from "vitest";
import { usePokemon } from "./usePokemon";

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

test("初期状態では、データは空でローディングもしていないこと", () => {
  const { result } = renderHook(() => usePokemon());

  expect(result.current.loading).toBe(false);
  expect(result.current.pokemonData).toBeNull();
  expect(result.current.error).toBe(false);
});

test("getRandomPokemonを実行すると、APIが呼ばれてデータがセットされること", async () => {
  const mockData = {
    name: "pikachu",
    sprites: { front_default: "dummy.png" },
  };

  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    ),
  );

  const { result } = renderHook(() => usePokemon());

  act(() => {
    result.current.getRandomPokemon();
  });

  await waitFor(() => {
    expect(result.current.pokemonData).toEqual(mockData);
  });

  expect(result.current.error).toBe(false);
  expect(result.current.loading).toBe(false);
});
