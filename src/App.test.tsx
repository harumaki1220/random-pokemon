import { render, screen, fireEvent } from "@testing-library/react";
import { vi, expect, test } from "vitest";
import App from "./App";
import "@testing-library/jest-dom";

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

  // 2. ボタンをクリック
  fireEvent.click(button);

  // 期待値：画面にエラーメッセージが出ること
  // findByText は非同期で要素が現れるのを待ってくれる
  const errorMessage = await screen.findByText(/ポケモンの取得に失敗しました/i);
  expect(errorMessage).toBeInTheDocument();

  // テストが終わったら偽物を片付ける
  vi.unstubAllGlobals();
});
