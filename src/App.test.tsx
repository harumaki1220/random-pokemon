import { render, screen, fireEvent } from "@testing-library/react";
import { vi, expect, test, afterEach } from "vitest";
import App from "./App";
import "@testing-library/jest-dom";

afterEach(() => {
  vi.unstubAllGlobals();
});

test("読み込み中はボタンが無効化されていること", () => {
  render(<App />);
  const button = screen.getByRole("button", { name: /ポケモンを呼ぶ/i });
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
  const button = screen.getByRole("button", { name: /ポケモンを呼ぶ/i });

  // ボタンをクリック
  fireEvent.click(button);

  // 期待値：画面にエラーメッセージが出ること
  // findByText は非同期で要素が現れるのを待ってくれる
  const errorMessage = await screen.findByText(/ポケモンの取得に失敗しました/i);
  expect(errorMessage).toBeInTheDocument();
});

test("API取得に成功したとき、ポケモンの名前と画像が表示されること", async () => {
  const mockPokemon = {
    name: "pikachu",
    sprites: {
      front_default: "https://example.com/pikachu.png",
    },
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
  const button = screen.getByRole("button", { name: /ポケモンを呼ぶ/i });
  fireEvent.click(button);

  // 期待値：ピカチュウの名前が表示されること
  expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();

  // 期待値：画像に正しいURLがセットされていること
  const image = screen.getByAltText(/pikachu/i);
  expect(image).toHaveAttribute("src", mockPokemon.sprites.front_default);
});

test("一度取得したポケモンを、別のポケモンの後に再度呼んだとき、fetch が呼ばれないこと", async () => {
  // 1. URLからIDを読み取って、違うポケモン（名前）を返す賢いモックにする
  const fetchMock = vi.fn((url: string | Request | URL) => {
    // 例: https://pokeapi.co/api/v2/pokemon/24 -> "24" を取り出す
    const id = url.toString().split("/").pop();
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          name: `pokemon-${id}`,
          sprites: { front_default: "dummy.png" },
        }),
    });
  });

  vi.stubGlobal("fetch", fetchMock);

  // 0.023 -> ID:24 / 0.001 -> ID:2 になるように調整
  vi.spyOn(Math, "random")
    .mockReturnValueOnce(0.023)
    .mockReturnValueOnce(0.001)
    .mockReturnValueOnce(0.023);

  render(<App />);
  const button = screen.getByRole("button", { name: /ポケモンを呼ぶ/i });

  // 1回目 (ID: 24)
  fireEvent.click(button);
  await screen.findByText(/pokemon-24/i); // ここで確実に待つ

  // 2回目 (ID: 2)
  fireEvent.click(button);
  await screen.findByText(/pokemon-2/i); // ここでも確実に待つ

  // 3回目 (再び ID: 24)
  fireEvent.click(button);
  await screen.findByText(/pokemon-24/i);

  expect(fetchMock).toHaveBeenCalledTimes(2);
});
