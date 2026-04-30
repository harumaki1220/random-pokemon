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
    types: [{ type: { name: "electric" } }],
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

test("API取得に失敗したとき、error状態がtrueになること", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      }),
    ),
  );

  const { result } = renderHook(() => usePokemon());

  act(() => {
    result.current.getRandomPokemon();
  });

  await waitFor(() => {
    expect(result.current.error).toBe(true);
  });

  expect(result.current.pokemonData).toBeNull();
  expect(result.current.loading).toBe(false);
});

test("キャッシュがある場合、APIは呼ばれずにキャッシュからデータが返ること", async () => {
  const mockCacheData = {
    name: "charmeleon",
    sprites: { front_default: "dummy5.png" },
    types: [{ type: { name: "fire" } }],
  };
  localStorage.setItem("pokemonCache", JSON.stringify({ 5: mockCacheData }));

  const fetchSpy = vi.fn();
  vi.stubGlobal("fetch", fetchSpy);

  const { result } = renderHook(() => usePokemon());

  act(() => {
    result.current.getPokemonById(5);
  });

  await waitFor(() => {
    expect(result.current.pokemonData).toEqual(mockCacheData);
  });

  expect(fetchSpy).toHaveBeenCalledTimes(0);
});
