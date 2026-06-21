import { useEffect, useRef, useState } from "react";
import ePub from "epubjs";
import { readBookBytes, updateProgress } from "../../services/libraryService";
import type { Book, ReadingTheme } from "../../types";
import { themeClasses } from "../../lib/utils";

interface EpubViewerProps {
  book: Book;
  theme: ReadingTheme;
  fontSize: number;
  onSelection: (detail: {
    text: string;
    context?: string;
    x: number;
    y: number;
    trigger: "selection" | "contextmenu";
  }) => void;
}

const epubThemeMap: Record<ReadingTheme, string> = {
  light: "#faf8f5",
  dark: "#1a1a1a",
  sepia: "#f4ecd8",
};

const epubTextMap: Record<ReadingTheme, string> = {
  light: "#111827",
  dark: "#f3f4f6",
  sepia: "#451a03",
};

export function EpubViewer({ book, theme, fontSize, onSelection }: EpubViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<import("epubjs").Rendition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const classes = themeClasses[theme];

  useEffect(() => {
    let cancelled = false;
    let bookInstance: ReturnType<typeof ePub> | null = null;

    (async () => {
      try {
        const bytes = await readBookBytes(book.id);
        const copy = Uint8Array.from(bytes);
        const blob = new Blob([copy], { type: "application/epub+zip" });
        const url = URL.createObjectURL(blob);

        bookInstance = ePub(url);
        const rendition = bookInstance.renderTo(containerRef.current!, {
          width: "100%",
          height: "100%",
          spread: "none",
        });

        renditionRef.current = rendition;

        await rendition.display(book.progress.cfi ?? undefined);

        rendition.themes.default({
          body: {
            background: epubThemeMap[theme],
            color: epubTextMap[theme],
            "font-size": `${fontSize}px`,
            "line-height": "1.6",
            padding: "1rem",
          },
        });

        rendition.on("relocated", (...args: unknown[]) => {
          const location = args[0] as { start: { cfi: string; percentage: number } };
          const cfi = location.start.cfi;
          const percent = location.start.percentage * 100;
          updateProgress(book.id, null, cfi, percent).catch(console.error);
        });

        const attachSelection = () => {
          const contents = rendition.getContents();
          contents.forEach((content) => {
            const doc = content.document;
            const readSelection = () => {
              const selection = doc.getSelection();
              if (!selection || selection.isCollapsed || !selection.toString().trim()) return null;
              const text = selection.toString().trim();
              const fullText = doc.body?.textContent ?? "";
              const idx = fullText.indexOf(text);
              const context =
                idx >= 0
                  ? fullText.slice(Math.max(0, idx - 200), Math.min(fullText.length, idx + text.length + 200))
                  : undefined;
              return { selection, text, context };
            };

            const frameOffset = () => {
              const frame = doc.defaultView?.frameElement as HTMLElement | null;
              const rect = frame?.getBoundingClientRect();
              return { left: rect?.left ?? 0, top: rect?.top ?? 0 };
            };

            const onContextMenu = (event: MouseEvent) => {
              const selected = readSelection();
              if (!selected) return;

              event.preventDefault();
              const offset = frameOffset();
              onSelection({
                text: selected.text,
                context: selected.context,
                x: offset.left + event.clientX,
                y: offset.top + event.clientY,
                trigger: "contextmenu",
              });
            };

            const onMouseUp = (event: MouseEvent) => {
              const offset = frameOffset();
              const x = offset.left + event.clientX;
              const y = offset.top + event.clientY;
              setTimeout(() => {
                const selected = readSelection();
                if (!selected) return;
                onSelection({
                  text: selected.text,
                  context: selected.context,
                  x,
                  y,
                  trigger: "selection",
                });
              }, 10);
            };

            const onTouchEnd = () => {
              setTimeout(() => {
                const selected = readSelection();
                if (!selected) return;
                const range = selected.selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const offset = frameOffset();
                onSelection({
                  text: selected.text,
                  context: selected.context,
                  x: offset.left + rect.left + rect.width / 2,
                  y: offset.top + rect.bottom,
                  trigger: "selection",
                });
              }, 10);
            };
            doc.addEventListener("contextmenu", onContextMenu);
            doc.addEventListener("mouseup", onMouseUp);
            doc.addEventListener("touchend", onTouchEnd);
          });
        };

        rendition.on("rendered", attachSelection);
        attachSelection();

        if (!cancelled) setLoading(false);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => {
      cancelled = true;
      if (renditionRef.current) {
        renditionRef.current.destroy();
        renditionRef.current = null;
      }
      if (bookInstance) {
        bookInstance.destroy();
      }
    };
  }, [book.id]);

  useEffect(() => {
    const rendition = renditionRef.current;
    if (!rendition) return;
    rendition.themes.default({
      body: {
        background: epubThemeMap[theme],
        color: epubTextMap[theme],
        "font-size": `${fontSize}px`,
        "line-height": "1.6",
        padding: "1rem",
      },
    });
  }, [theme, fontSize]);

  const goPrev = () => renditionRef.current?.prev();
  const goNext = () => renditionRef.current?.next();

  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className={`flex flex-col flex-1 min-h-0 ${classes.bg}`}>
      {loading && <p className="p-4 text-gray-500">Loading EPUB…</p>}
      <div ref={containerRef} className="flex-1 min-h-0" />
      <div className="flex items-center justify-center gap-4 py-2 text-sm border-t border-black/10">
        <button type="button" className="min-h-[44px] px-4 rounded-lg hover:bg-black/5" onClick={goPrev}>
          ← Prev
        </button>
        <button type="button" className="min-h-[44px] px-4 rounded-lg hover:bg-black/5" onClick={goNext}>
          Next →
        </button>
      </div>
    </div>
  );
}
