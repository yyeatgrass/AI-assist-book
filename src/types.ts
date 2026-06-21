export interface BookProgress {
  page: number | null;
  cfi: string | null;
  percent: number;
}

export interface Book {
  id: string;
  title: string;
  format: "pdf" | "epub" | string;
  file_name: string;
  added_at: string;
  last_read_at: string | null;
  progress: BookProgress;
}

export type ReadingTheme = "light" | "dark" | "sepia";

export type AppView = "library" | "reader" | "settings";

export interface TextSelection {
  text: string;
  context?: string;
  x: number;
  y: number;
  trigger: "selection" | "contextmenu";
}

export interface ExplainState {
  open: boolean;
  loading: boolean;
  error: string | null;
  selectedText: string;
  context?: string;
  explanation: string | null;
}
