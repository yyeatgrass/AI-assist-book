import { useBreakpoint } from "../../hooks/useBreakpoint";
import { BottomSheet } from "./BottomSheet";
import { SidePanel } from "./SidePanel";

interface AdaptivePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function AdaptivePanel({ open, onClose, title, children }: AdaptivePanelProps) {
  const { isMobile } = useBreakpoint();

  if (isMobile) {
    return (
      <BottomSheet open={open} onClose={onClose} title={title}>
        {children}
      </BottomSheet>
    );
  }

  return (
    <SidePanel open={open} onClose={onClose} title={title}>
      {children}
    </SidePanel>
  );
}
