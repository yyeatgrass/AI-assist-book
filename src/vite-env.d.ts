/// <reference types="vite/client" />

declare module "epubjs" {
  export interface Rendition {
    display(target?: string): Promise<void>;
    destroy(): void;
    prev(): void;
    next(): void;
    themes: {
      default(styles: Record<string, Record<string, string>>): void;
    };
    on(event: string, callback: (...args: unknown[]) => void): void;
    getContents(): Array<{ document: Document }>;
  }

  export interface Book {
    renderTo(element: HTMLElement, options: Record<string, string>): Rendition;
    destroy(): void;
  }

  function ePub(url: string): Book;
  export default ePub;
}
