import { useEffect, useRef } from "react";

export function useTextSelection(containerRef: React.RefObject<HTMLElement | null>) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleSelection = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed || !selection.toString().trim()) return;

        const text = selection.toString().trim();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const containerRect = container.getBoundingClientRect();
        const relativeRect = {
          top: rect.top - containerRect.top,
          left: rect.left - containerRect.left,
          width: rect.width,
          height: rect.height,
        };

        let context = "";
        try {
          const fullText = container.textContent ?? "";
          const idx = fullText.indexOf(text);
          if (idx >= 0) {
            const start = Math.max(0, idx - 200);
            const end = Math.min(fullText.length, idx + text.length + 200);
            context = fullText.slice(start, end);
          }
        } catch {
          /* ignore */
        }

        const event = new CustomEvent("reader-selection", {
          detail: { text, context, rect: relativeRect },
        });
        container.dispatchEvent(event);
      }, 150);
    };

    container.addEventListener("mouseup", handleSelection);
    container.addEventListener("touchend", handleSelection);

    return () => {
      container.removeEventListener("mouseup", handleSelection);
      container.removeEventListener("touchend", handleSelection);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [containerRef]);
}
