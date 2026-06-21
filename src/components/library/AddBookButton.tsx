import { open } from "@tauri-apps/plugin-dialog";
import { Button } from "../ui/Button";

interface AddBookButtonProps {
  onImported: () => void;
  importing: boolean;
  setImporting: (v: boolean) => void;
  onError: (msg: string) => void;
}

export function AddBookButton({
  onImported,
  importing,
  setImporting,
  onError,
}: AddBookButtonProps) {
  const handleAdd = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "Books", extensions: ["pdf", "epub"] }],
      });

      if (!selected || typeof selected !== "string") return;

      setImporting(true);
      const { importBook } = await import("../../services/libraryService");
      await importBook(selected);
      onImported();
    } catch (e) {
      onError(e instanceof Error ? e.message : String(e));
    } finally {
      setImporting(false);
    }
  };

  return (
    <Button onClick={handleAdd} disabled={importing}>
      {importing ? "Adding…" : "+ Add Book"}
    </Button>
  );
}
