import { render, screen, fireEvent } from "@testing-library/react";
import { vi, expect, test, afterEach } from "vitest";
import App from "./App";
import "@testing-library/jest-dom";

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

test("読み込み中はボタンが無効化されていること", () => {
  render(<App />);
  const button = screen.getByRole("button", { name: /Get Pokémon/i });
  fireEvent.click(button);
  expect(button).toBeDisabled();
});

test("API取得に失敗したとき、エラーメッセージが表示されること", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      }),
    ),
  );

  render(<App />);
  const button = screen.getByRole("button", { name: /Get Pokémon/i });

  fireEvent.click(button);

  const errorMessage = await screen.findByText(/Failed to fetch/i);
  expect(errorMessage).toBeInTheDocument();
});

test("API取得に成功したとき、ポケモンの名前と画像が表示されること", async () => {
  const mockPokemon = {
    name: "pikachu",
    sprites: {
      front_default: "https://example.com/pikachu.png",
    },
    types: [
      {
        type: {
          name: "electric",
        },
      },
    ],
  };

  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPokemon),
      }),
    ),
  );

  render(<App />);
  const button = screen.getByRole("button", { name: /Get Pokémon/i });
  fireEvent.click(button);

  expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
  const image = screen.getByAltText(/pikachu/i);
  expect(image).toHaveAttribute("src", mockPokemon.sprites.front_default);
});

test("一度取得したポケモンを、別のポケモンの後に再度呼んだとき、fetch が呼ばれないこと", async () => {
  const fetchMock = vi.fn((url: string | Request | URL) => {
    const id = url.toString().split("/").pop();
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          name: `pokemon-${id}`,
          sprites: { front_default: "dummy.png" },
          types: [
            {
              type: {
                name: "normal",
              },
            },
          ],
        }),
    });
  });

  vi.stubGlobal("fetch", fetchMock);

  vi.spyOn(Math, "random")
    .mockReturnValueOnce(0.023)
    .mockReturnValueOnce(0.001)
    .mockReturnValueOnce(0.023);

  render(<App />);
  const button = screen.getByRole("button", { name: /Get Pokémon/i });

  fireEvent.click(button);
  await screen.findByText(/pokemon-24/i);

  fireEvent.click(button);
  await screen.findByText(/pokemon-2/i);

  fireEvent.click(button);
  await screen.findByText(/pokemon-24/i);

  expect(fetchMock).toHaveBeenCalledTimes(2);
});
