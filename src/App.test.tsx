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
