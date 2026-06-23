import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/** 全画面共通の外枠。幅・高さ・背景を統一する。 */
export default function AppShell({ children }: Props) {
  return (
    <div className="flex justify-center min-h-screen" style={{ backgroundColor: "var(--line-bg)" }}>
      <div
        className="relative flex flex-col w-full h-screen overflow-hidden bg-white"
        style={{ maxWidth: 430 }}
      >
        {children}
      </div>
    </div>
  );
}
