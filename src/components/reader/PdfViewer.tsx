import { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import { TextLayer } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { readBookBytes, updateProgress } from "../../services/libraryService";
import type { Book, ReadingTheme } from "../../types";
import { themeClasses } from "../../lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PdfViewerProps {
  book: Book;
  theme: ReadingTheme;
  onSelection: (detail: {
    text: string;
    context?: string;
    x: number;
    y: number;
    trigger: "selection" | "contextmenu";
  }) => void;
}

export function PdfViewer({ book, theme, onSelection }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(book.progress.page ?? 1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const classes = themeClasses[theme];

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const bytes = await readBookBytes(book.id);
        const doc = await pdfjs.getDocument({ data: bytes }).promise;
        if (cancelled) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setPage(book.progress.page ?? 1);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [book.id]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !textLayerRef.current || containerWidth === 0) return;

    let cancelled = false;
    let textLayerInstance: TextLayer | null = null;

    (async () => {
      const pdfPage = await pdfDoc.getPage(page);
      if (cancelled) return;

      const canvas = canvasRef.current!;
      const context = canvas.getContext("2d")!;

      const unscaled = pdfPage.getViewport({ scale: 1 });
      const maxWidth = Math.max(280, containerWidth - 32);
      const displayScale = Math.min(2, maxWidth / unscaled.width);
      const viewport = pdfPage.getViewport({ scale: displayScale });

      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const renderParams = {
        canvasContext: context,
        viewport,
        transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined,
      } as Parameters<typeof pdfPage.render>[0];
      await pdfPage.render(renderParams).promise;
      if (cancelled) return;

      const textLayerDiv = textLayerRef.current!;
      textLayerDiv.replaceChildren();
      textLayerDiv.style.setProperty("--scale-factor", String(displayScale));

      const textContent = await pdfPage.getTextContent();
      if (cancelled) return;

      textLayerInstance = new TextLayer({
        textContentSource: textContent,
        container: textLayerDiv,
        viewport,
      });
      await textLayerInstance.render();

      const percent = totalPages > 0 ? (page / totalPages) * 100 : 0;
      await updateProgress(book.id, page, null, percent);
    })();

    return () => {
      cancelled = true;
      textLayerInstance?.cancel();
    };
  }, [pdfDoc, page, book.id, totalPages, containerWidth]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => setContainerWidth(container.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getSelectedText = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) return null;
      const text = selection.toString().trim();
      const fullText = textLayerRef.current?.textContent ?? "";
      const idx = fullText.indexOf(text);
      const context =
        idx >= 0
          ? fullText.slice(Math.max(0, idx - 200), Math.min(fullText.length, idx + text.length + 200))
          : undefined;
      return { selection, text, context };
    };

    const onContextMenu = (event: MouseEvent) => {
      const selected = getSelectedText();
      if (!selected) return;

      event.preventDefault();
      onSelection({
        text: selected.text,
        context: selected.context,
        x: event.clientX,
        y: event.clientY,
        trigger: "contextmenu",
      });
    };

    const showSelectionToolbar = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      setTimeout(() => {
        const selected = getSelectedText();
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
        const selected = getSelectedText();
        if (!selected) return;
        const range = selected.selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        onSelection({
          text: selected.text,
          context: selected.context,
          x: rect.left + rect.width / 2,
          y: rect.bottom,
          trigger: "selection",
        });
      }, 10);
    };

    container.addEventListener("contextmenu", onContextMenu);
    container.addEventListener("mouseup", showSelectionToolbar);
    container.addEventListener("touchend", onTouchEnd);
    return () => {
      container.removeEventListener("contextmenu", onContextMenu);
      container.removeEventListener("mouseup", showSelectionToolbar);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [onSelection, loading]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalPages]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 60) goPrev();
    if (delta < -60) goNext();
    touchStartX.current = null;
  };

  if (loading) return <p className="p-4 text-gray-500">Loading PDF…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className={`flex flex-col flex-1 min-h-0 ${classes.bg}`}>
      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex justify-center p-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative shadow-md self-start">
          <canvas ref={canvasRef} className="block" />
          <div ref={textLayerRef} className="textLayer" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 py-2 text-sm border-t border-black/10 shrink-0">
        <button type="button" className="min-h-[44px] px-4 rounded-lg hover:bg-black/5" onClick={goPrev}>
          ← Prev
        </button>
        <span>{page} / {totalPages || "—"}</span>
        <button type="button" className="min-h-[44px] px-4 rounded-lg hover:bg-black/5" onClick={goNext}>
          Next →
        </button>
      </div>
    </div>
  );
}
