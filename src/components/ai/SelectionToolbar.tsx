import { useEffect, useRef, useState } from "react";

interface SelectionToolbarProps {
  x: number;
  y: number;
  onExplain: () => void;
  onCopy: () => void;
  onClose: () => void;
}

export function SelectionToolbar({ x, y, onExplain, onCopy, onClose }: SelectionToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: y + 8, left: x });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 8;
    let left = x;
    let top = y + 8;

    if (left + rect.width + margin > window.innerWidth) {
      left = window.innerWidth - rect.width - margin;
    }
    if (left < margin) left = margin;

    if (top + rect.height + margin > window.innerHeight) {
      top = y - rect.height - 8;
    }
    if (top < margin) top = margin;

    setPos({ top, left });
  }, [x, y]);

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-[230px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
      style={{ top: pos.top, left: pos.left }}
    >
      <button
        type="button"
        onClick={onExplain}
        className="block min-h-[44px] w-full px-4 text-left text-sm font-semibold text-blue-600 hover:bg-blue-50"
      >
        Ask AI: what does this mean?
      </button>
      <button
        type="button"
        onClick={onCopy}
        className="block min-h-[44px] w-full px-4 text-left text-sm text-gray-700 hover:bg-gray-100"
      >
        Copy selected text
      </button>
      <button
        type="button"
        onClick={onClose}
        className="block min-h-[44px] w-full px-4 text-left text-sm text-gray-500 hover:bg-gray-100"
      >
        Dismiss
      </button>
    </div>
  );
}
