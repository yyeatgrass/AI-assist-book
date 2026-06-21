import type { Book } from "../../types";
import { formatDate, formatPercent } from "../../lib/utils";
import { Button } from "../ui/Button";

interface BookCardProps {
  book: Book;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
}

export function BookCard({ book, onOpen, onRemove }: BookCardProps) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
      onClick={() => onOpen(book.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
        <span className="shrink-0 text-xs font-medium uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
          {book.format}
        </span>
      </div>
      <div className="text-sm text-gray-500 space-y-1">
        <p>Progress: {formatPercent(book.progress.percent)}</p>
        <p>Last read: {formatDate(book.last_read_at)}</p>
      </div>
      <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
        <Button variant="secondary" className="flex-1" onClick={() => onOpen(book.id)}>
          Open
        </Button>
        <Button variant="ghost" onClick={() => onRemove(book.id)}>Remove</Button>
      </div>
    </div>
  );
}
