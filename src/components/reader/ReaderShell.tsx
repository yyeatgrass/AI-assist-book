import { useCallback, useState } from "react";
import { useAppStore } from "../../stores/appStore";
import type { ReadingTheme } from "../../types";
import { themeClasses } from "../../lib/utils";
import { PdfViewer } from "./PdfViewer";
import { EpubViewer } from "./EpubViewer";
import { SelectionToolbar } from "../ai/SelectionToolbar";

export function ReaderShell() {
  const books = useAppStore((s) => s.books);
  const currentBookId = useAppStore((s) => s.currentBookId);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const closeReader = useAppStore((s) => s.closeReader);
  const setSelection = useAppStore((s) => s.setSelection);
  const selection = useAppStore((s) => s.selection);
  const openExplain = useAppStore((s) => s.openExplain);

  const [fontSize, setFontSize] = useState(18);

  const book = books.find((b) => b.id === currentBookId);

  const handleSelection = useCallback(
    (detail: {
      text: string;
      context?: string;
      x: number;
      y: number;
      trigger: "selection" | "contextmenu";
    }) => {
      setSelection(detail);
    },
    [setSelection],
  );

  const cycleTheme = () => {
    const order: ReadingTheme[] = ["light", "sepia", "dark"];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  if (!book) {
    return (
      <div className="p-8 text-center text-gray-500">
        Book not found.
        <button className="ml-2 underline" onClick={closeReader}>Back</button>
      </div>
    );
  }

  const classes = themeClasses[theme];

  return (
    <div className={`flex flex-col h-screen h-dvh ${classes.bg} ${classes.text} safe-top safe-bottom`}>
      <header className={`flex items-center gap-2 px-3 py-2 border-b shrink-0 ${classes.bar}`}>
        <button
          type="button"
          onClick={closeReader}
          className="min-h-[44px] min-w-[44px] rounded-lg hover:bg-black/5"
          aria-label="Back to library"
        >
          ←
        </button>
        <h1 className="flex-1 text-sm md:text-base font-medium truncate">{book.title}</h1>
        {book.format === "epub" && (
          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              className="min-h-[44px] px-2 rounded-lg hover:bg-black/5"
              onClick={() => setFontSize((s) => Math.max(12, s - 2))}
            >
              A−
            </button>
            <span>{fontSize}px</span>
            <button
              type="button"
              className="min-h-[44px] px-2 rounded-lg hover:bg-black/5"
              onClick={() => setFontSize((s) => Math.min(28, s + 2))}
            >
              A+
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={cycleTheme}
          className="min-h-[44px] px-3 rounded-lg hover:bg-black/5 text-sm"
        >
          Theme
        </button>
      </header>

      <div className="relative flex flex-col flex-1 min-h-0">
        {book.format === "pdf" ? (
          <PdfViewer book={book} theme={theme} onSelection={handleSelection} />
        ) : (
          <EpubViewer
            book={book}
            theme={theme}
            fontSize={fontSize}
            onSelection={handleSelection}
          />
        )}

        {selection && (
          <SelectionToolbar
            x={selection.x}
            y={selection.y}
            onExplain={() => openExplain(selection.text, selection.context)}
            onClose={() => setSelection(null)}
          />
        )}
      </div>
    </div>
  );
}
