import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAppStore } from "../../stores/appStore";
import { aiExplain } from "../../services/libraryService";
import { getApiKey, getModel } from "../../services/settingsService";
import { AdaptivePanel } from "../ui/AdaptivePanel";
import { Button } from "../ui/Button";

export function ExplainPanel() {
  const explain = useAppStore((s) => s.explain);
  const closeExplain = useAppStore((s) => s.closeExplain);
  const setExplainError = useAppStore((s) => s.setExplainError);
  const setExplanation = useAppStore((s) => s.setExplanation);
  const openExplain = useAppStore((s) => s.openExplain);

  const [followUp, setFollowUp] = useState("");

  useEffect(() => {
    if (!explain.open || !explain.loading) return;

    let cancelled = false;

    (async () => {
      try {
        const apiKey = await getApiKey();
        const model = await getModel();
        const result = await aiExplain(
          explain.selectedText,
          explain.context,
          apiKey,
          model,
        );
        if (!cancelled) setExplanation(result);
      } catch (e) {
        if (!cancelled) {
          setExplainError(e instanceof Error ? e.message : String(e));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [explain.open, explain.loading, explain.selectedText, explain.context]);

  const handleFollowUp = async () => {
    if (!followUp.trim()) return;
    const combined = `${explain.selectedText}\n\nFollow-up question: ${followUp}`;
    openExplain(combined, explain.context);
    setFollowUp("");
  };

  return (
    <AdaptivePanel open={explain.open} onClose={closeExplain} title="AI解读">
      <div className="space-y-4">
        <blockquote className="text-sm text-gray-600 border-l-4 border-blue-200 pl-3 italic">
          {explain.selectedText}
        </blockquote>

        {explain.loading && (
          <p className="text-gray-500 text-sm">Thinking…</p>
        )}

        {explain.error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            {explain.error}
            <p className="mt-2 text-xs">
              Check your API key in Settings and ensure you have network access.
            </p>
          </div>
        )}

        {explain.explanation && (
          <div className="prose prose-sm max-w-none text-gray-800 prose-headings:font-semibold prose-headings:text-gray-900 prose-strong:text-gray-900 prose-li:my-0.5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {explain.explanation}
            </ReactMarkdown>
          </div>
        )}

        {!explain.loading && explain.explanation && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-sm font-medium text-gray-700">Ask a follow-up</label>
            <textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="e.g. Can you explain this term more simply?"
              className="w-full min-h-[80px] p-3 border border-gray-300 rounded-lg text-sm resize-y"
            />
            <Button onClick={handleFollowUp} disabled={!followUp.trim()}>
              Ask
            </Button>
          </div>
        )}
      </div>
    </AdaptivePanel>
  );
}
