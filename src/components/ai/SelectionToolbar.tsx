import { useEffect, useRef, useState } from "react";

interface SelectionToolbarProps {
  x: number;
  y: number;
  onExplain: () => void;
  onClose: () => void;
}

export function SelectionToolbar({ x, y, onExplain, onClose }: SelectionToolbarProps) {
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
    <>
      {/* Transparent backdrop: clicking anywhere outside the toolbar dismisses it. */}
      <div className="fixed inset-0 z-40" onMouseDown={onClose} />
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
          问问 AI：这段是什么意思？
        </button>
      </div>
    </>
  );
}
