import { useEffect, useState } from "react";
import { useAppStore } from "../../stores/appStore";
import {
  getApiKey,
  getModel,
  setApiKey,
  setModel,
} from "../../services/settingsService";
import { Button } from "../ui/Button";

export function SettingsView() {
  const setView = useAppStore((s) => s.setView);
  const [apiKey, setApiKeyLocal] = useState("");
  const [model, setModelLocal] = useState("deepseek-chat");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setApiKeyLocal(await getApiKey());
      setModelLocal(await getModel());
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    await setApiKey(apiKey);
    await setModel(model);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-top safe-bottom">
      <header className="bg-white border-b border-gray-200 px-4 py-4 md:px-8">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => setView("library")}
            className="min-h-[44px] min-w-[44px] rounded-lg hover:bg-gray-100"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 md:px-8 space-y-6">
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <>
            <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">DeepSeek API</h2>
              <p className="text-sm text-gray-500">
                Get a free API key at{" "}
                <a
                  href="https://platform.deepseek.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  platform.deepseek.com
                </a>
                . Your key is stored locally on this device.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKeyLocal(e.target.value)}
                  placeholder="sk-…"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModelLocal(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="deepseek-chat">deepseek-chat (default)</option>
                  <option value="deepseek-reasoner">deepseek-reasoner (harder passages)</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleSave}>Save</Button>
                {saved && <span className="text-sm text-green-600">Saved!</span>}
              </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-2">Platforms</h2>
              <p className="text-sm text-gray-500">
                This app targets macOS, Windows, Linux, iOS, and Android from one codebase.
                Run <code className="bg-gray-100 px-1 rounded">npm run tauri ios init</code> or{" "}
                <code className="bg-gray-100 px-1 rounded">npm run tauri android init</code> to add mobile targets.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
