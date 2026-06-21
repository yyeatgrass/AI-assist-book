import { invoke } from "@tauri-apps/api/core";
import type { Book } from "../types";

export async function listBooks(): Promise<Book[]> {
  return invoke<Book[]>("list_books");
}

export async function importBook(sourcePath: string): Promise<Book> {
  return invoke<Book>("import_book", { sourcePath });
}

export async function removeBook(id: string): Promise<void> {
  return invoke("remove_book", { id });
}

export async function updateProgress(
  id: string,
  page: number | null,
  cfi: string | null,
  percent: number,
): Promise<void> {
  return invoke("update_progress", { id, page, cfi, percent });
}

export async function readBookBytes(id: string): Promise<Uint8Array> {
  const bytes = await invoke<number[]>("read_book_bytes", { id });
  return Uint8Array.from(bytes);
}

export async function aiExplain(
  text: string,
  context: string | undefined,
  apiKey: string,
  model: string,
): Promise<string> {
  const result = await invoke<{ explanation: string }>("ai_explain", {
    text,
    context,
    apiKey,
    model,
  });
  return result.explanation;
}
