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
    hooks: {
      content: {
        register(hook: (contents: { document: Document }) => void): void;
      };
    };
  }

  export interface Book {
    renderTo(element: HTMLElement, options: Record<string, string>): Rendition;
    destroy(): void;
  }

  function ePub(input: string | ArrayBuffer, options?: Record<string, unknown>): Book;
  export default ePub;
}
