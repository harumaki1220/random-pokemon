import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "./App";
import "@testing-library/jest-dom";

test("読み込み中はボタンが無効化されていること", () => {
  render(<App />);
  const button = screen.getByRole("button", { name: /ポケモンを呼ぶ/i });

  // ボタンをクリック
  fireEvent.click(button);

  // 期待値：ボタンが disabled になっていること
  expect(button).toBeDisabled();
});
