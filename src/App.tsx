import { useEffect } from "react";
import { useAppStore } from "./stores/appStore";
import { LibraryView } from "./components/library/LibraryView";
import { ReaderShell } from "./components/reader/ReaderShell";
import { SettingsView } from "./components/settings/SettingsView";
import { ExplainPanel } from "./components/ai/ExplainPanel";

function App() {
  const view = useAppStore((s) => s.view);
  const closeExplain = useAppStore((s) => s.closeExplain);
  const explainOpen = useAppStore((s) => s.explain.open);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && explainOpen) {
        closeExplain();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [explainOpen, closeExplain]);

  return (
    <>
      {view === "library" && <LibraryView />}
      {view === "reader" && <ReaderShell />}
      {view === "settings" && <SettingsView />}
      <ExplainPanel />
    </>
  );
}

export default App;
