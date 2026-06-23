"use client";

import { useRouter } from "next/navigation";
import type { SystemInfo } from "@/generated/prisma/models";
import AppShell from "./AppShell";

interface Props {
  systemInfo: SystemInfo | null;
}

export default function LoginScreen({ systemInfo }: Props) {
  const router = useRouter();

  return (
    <AppShell>
      {/* ロゴエリア */}
      <div
        className="flex flex-col items-center justify-center flex-1 gap-6 px-8"
        style={{ backgroundColor: "var(--line-green)" }}
      >
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-16 h-16"
            style={{ fill: "var(--line-green)" }}
          >
            <path d="M24 4C12.95 4 4 11.87 4 21.5c0 5.67 3.1 10.7 7.93 13.94-.35 1.27-1.27 4.6-1.46 5.32-.23.9.33 1.89 1.24 1.89.22 0 .44-.06.64-.19l6.63-4.4c1.63.35 3.32.54 5.02.54 11.05 0 20-7.87 20-17.5C44 11.87 35.05 4 24 4z" />
            <path d="M16 23h-2v-6h2v6zm8 0h-2l-3-4v4h-2v-6h2l3 4v-4h2v6zm6 0h-5v-6h2v4h3v2zm4-4h-2v4h-2v-4h-2v-2h6v2z" fill="white" />
          </svg>
        </div>

        <div className="text-center text-white">
          <h1 className="text-3xl font-bold tracking-wide">
            {systemInfo?.systemName ?? "LINE App"}
          </h1>
          {systemInfo?.version && (
            <p className="text-sm opacity-75 mt-1">v{systemInfo.version}</p>
          )}
          {systemInfo?.description && (
            <p className="text-xs opacity-60 mt-1">{systemInfo.description}</p>
          )}
        </div>
      </div>

      {/* フォームエリア */}
      <div className="flex flex-col gap-4 px-6 py-8 bg-white flex-shrink-0">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              メールアドレス / 電話番号
            </label>
            <input
              type="text"
              placeholder="example@email.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none bg-gray-50"
              style={{ "--tw-ring-color": "var(--line-green)" } as React.CSSProperties}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">パスワード</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none bg-gray-50"
            />
          </div>
        </div>

        <button
          onClick={() => router.push("/talk")}
          className="w-full py-3 rounded-full text-white text-sm font-bold tracking-wide transition-opacity active:opacity-80"
          style={{ backgroundColor: "var(--line-green)" }}
        >
          ログイン
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">または</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button className="w-full py-3 rounded-full border border-gray-300 text-gray-600 text-sm font-medium transition-colors hover:bg-gray-50 active:bg-gray-100">
          QRコードでログイン
        </button>

        <p className="text-center text-xs text-gray-400">
          アカウントをお持ちでない方は{" "}
          <span className="font-medium cursor-pointer" style={{ color: "var(--line-green)" }}>
            新規登録
          </span>
        </p>
      </div>
    </AppShell>
  );
}
