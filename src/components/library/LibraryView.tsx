import { useEffect, useState } from "react";
import { useAppStore } from "../../stores/appStore";
import { listBooks, removeBook } from "../../services/libraryService";
import { AddBookButton } from "./AddBookButton";
import { BookCard } from "./BookCard";
import { Button } from "../ui/Button";

export function LibraryView() {
  const books = useAppStore((s) => s.books);
  const setBooks = useAppStore((s) => s.setBooks);
  const openBook = useAppStore((s) => s.openBook);
  const removeBookFromStore = useAppStore((s) => s.removeBook);
  const setView = useAppStore((s) => s.setView);

  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await listBooks();
      setBooks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await removeBook(id);
      removeBookFromStore(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-top safe-bottom">
      <header className="bg-white border-b border-gray-200 px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Assist Book</h1>
            <p className="text-sm text-gray-500">Read PDF & EPUB with AI explanations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setView("settings")}>
              Settings
            </Button>
            <AddBookButton
              onImported={refresh}
              importing={importing}
              setImporting={setImporting}
              onError={setError}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:px-8">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            {error}
            <button className="ml-2 underline" onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading library…</p>
        ) : books.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No books yet. Add a PDF or EPUB to get started.</p>
            <AddBookButton
              onImported={refresh}
              importing={importing}
              setImporting={setImporting}
              onError={setError}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onOpen={openBook}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
