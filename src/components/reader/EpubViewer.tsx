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
    let selectionPoll: number | undefined;

    (async () => {
      try {
        const bytes = await readBookBytes(book.id);
        const copy = Uint8Array.from(bytes);
        const buffer = copy.buffer.slice(copy.byteOffset, copy.byteOffset + copy.byteLength);

        // Pass the raw ArrayBuffer so epub.js opens it as a zip archive. Passing a
        // blob: URL makes epub.js misdetect it as an unpacked directory and hang.
        bookInstance = ePub(buffer);
        const rendition = bookInstance.renderTo(containerRef.current!, {
          width: "100%",
          height: "100%",
          spread: "none",
        });

        renditionRef.current = rendition;

        const computeContext = (doc: Document, text: string) => {
          const fullText = doc.body?.textContent ?? "";
          const idx = fullText.indexOf(text);
          return idx >= 0
            ? fullText.slice(Math.max(0, idx - 200), Math.min(fullText.length, idx + text.length + 200))
            : undefined;
        };

        const reportSelection = (win: Window, doc: Document) => {
          const sel = win.getSelection();
          if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
          const text = sel.toString().trim();
          if (!text) return;

          const range = sel.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const frame = doc.defaultView?.frameElement as HTMLElement | null;
          const frameRect = frame?.getBoundingClientRect();
          const offsetLeft = frameRect?.left ?? 0;
          const offsetTop = frameRect?.top ?? 0;

          const x = offsetLeft + rect.left + rect.width / 2;
          const y = offsetTop + rect.bottom;

          onSelection({
            text,
            context: computeContext(doc, text),
            x,
            y,
            trigger: "selection",
          });
        };

        // WKWebView (macOS/iOS) does not reliably deliver selectionchange /
        // mouseup events from inside the epub.js iframe to listeners we attach,
        // so event-based detection silently fails. Instead we poll the rendered
        // iframe for a selection. This is robust across every webview.
        let lastReported = "";
        selectionPoll = window.setInterval(() => {
          const iframe = containerRef.current?.querySelector("iframe") as
            | HTMLIFrameElement
            | null;
          const win = iframe?.contentWindow as Window | null;
          const doc = iframe?.contentDocument as Document | null;
          if (!win || !doc) return;

          const sel = win.getSelection();
          if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
            lastReported = "";
            return;
          }
          const text = sel.toString().trim();
          if (!text || text === lastReported) return;
          lastReported = text;
          reportSelection(win, doc);
        }, 300);

        rendition.on("relocated", (...args: unknown[]) => {
          const location = args[0] as { start: { cfi: string; percentage: number } };
          const cfi = location.start.cfi;
          const percent = location.start.percentage * 100;
          updateProgress(book.id, null, cfi, percent).catch(console.error);
        });

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

        if (!cancelled) setLoading(false);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();

    return () => {
      cancelled = true;
      if (selectionPoll) window.clearInterval(selectionPoll);
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
