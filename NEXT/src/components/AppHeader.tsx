import type { ReactNode } from "react";

interface Props {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  title?: string;
  subtitle?: string;
}

/** 全画面共通ヘッダー。高さ・パディング・背景色を統一する。 */
export default function AppHeader({ left, center, right, title, subtitle }: Props) {
  return (
    <header
      className="flex items-center gap-2 px-4 text-white flex-shrink-0"
      style={{ backgroundColor: "var(--line-green)", height: 56 }}
    >
      {/* 左ゾーン */}
      <div className="flex items-center gap-2 flex-shrink-0 w-10">
        {left}
      </div>

      {/* 中央ゾーン */}
      <div className="flex-1 min-w-0">
        {center ?? (
          <div>
            {title && <p className="font-bold text-base leading-tight truncate">{title}</p>}
            {subtitle && <p className="text-xs opacity-70 leading-tight">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* 右ゾーン */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {right}
      </div>
    </header>
  );
}

/** ヘッダー内のアイコンボタン共通スタイル */
export function HeaderIconButton({
  onClick,
  label,
  children,
}: {
  onClick?: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 active:bg-white/30 transition-colors"
    >
      {children}
    </button>
  );
}
