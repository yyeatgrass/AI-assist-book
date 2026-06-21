import { create } from "zustand";
import type { AppView, Book, ExplainState, ReadingTheme, TextSelection } from "../types";

interface AppState {
  view: AppView;
  books: Book[];
  currentBookId: string | null;
  theme: ReadingTheme;
  selection: TextSelection | null;
  explain: ExplainState;
  setView: (view: AppView) => void;
  setBooks: (books: Book[]) => void;
  addBook: (book: Book) => void;
  removeBook: (id: string) => void;
  openBook: (id: string) => void;
  closeReader: () => void;
  setTheme: (theme: ReadingTheme) => void;
  setSelection: (selection: TextSelection | null) => void;
  openExplain: (text: string, context?: string) => void;
  closeExplain: () => void;
  setExplainLoading: (loading: boolean) => void;
  setExplainError: (error: string | null) => void;
  setExplanation: (explanation: string) => void;
}

const defaultExplain: ExplainState = {
  open: false,
  loading: false,
  error: null,
  selectedText: "",
  explanation: null,
};

export const useAppStore = create<AppState>((set) => ({
  view: "library",
  books: [],
  currentBookId: null,
  theme: "light",
  selection: null,
  explain: defaultExplain,

  setView: (view) => set({ view }),
  setBooks: (books) => set({ books }),
  addBook: (book) => set((s) => ({ books: [...s.books, book] })),
  removeBook: (id) =>
    set((s) => ({
      books: s.books.filter((b) => b.id !== id),
      currentBookId: s.currentBookId === id ? null : s.currentBookId,
      view: s.currentBookId === id ? "library" : s.view,
    })),
  openBook: (id) => set({ currentBookId: id, view: "reader" }),
  closeReader: () => set({ currentBookId: null, view: "library", selection: null, explain: defaultExplain }),
  setTheme: (theme) => set({ theme }),
  setSelection: (selection) => set({ selection }),
  openExplain: (text, context) =>
    set({
      explain: {
        open: true,
        loading: true,
        error: null,
        selectedText: text,
        context,
        explanation: null,
      },
      selection: null,
    }),
  closeExplain: () => set({ explain: defaultExplain }),
  setExplainLoading: (loading) => set((s) => ({ explain: { ...s.explain, loading } })),
  setExplainError: (error) => set((s) => ({ explain: { ...s.explain, error, loading: false } })),
  setExplanation: (explanation) =>
    set((s) => ({ explain: { ...s.explain, explanation, loading: false, error: null } })),
}));
