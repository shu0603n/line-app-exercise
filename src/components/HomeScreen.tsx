"use client";

import { useRouter } from "next/navigation";
import type { SystemInfo, ChatRoom, Message } from "@/generated/prisma/models";
import AppShell from "./AppShell";
import AppHeader, { HeaderIconButton } from "./AppHeader";

type RoomWithLastMessage = ChatRoom & {
  messages: Pick<Message, "content" | "sentAt" | "isMine">[];
};

interface Props {
  systemInfo: SystemInfo | null;
  rooms: RoomWithLastMessage[];
}

function formatTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "昨日";
  if (diffDays < 7) return ["日", "月", "火", "水", "木", "金", "土"][d.getDay()] + "曜";
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

const NAV_TABS = [
  {
    label: "トーク", active: true,
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>,
  },
  {
    label: "友だち", active: false,
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>,
  },
  {
    label: "ニュース", active: false,
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" /></svg>,
  },
  {
    label: "その他", active: false,
    icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>,
  },
];

export default function HomeScreen({ systemInfo, rooms }: Props) {
  const router = useRouter();

  return (
    <AppShell>
      <AppHeader
        title={systemInfo?.systemName ?? "LINE App"}
        subtitle={systemInfo ? `v${systemInfo.version}` : undefined}
        right={
          <>
            <HeaderIconButton label="検索">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </HeaderIconButton>
            <HeaderIconButton label="新規追加">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </HeaderIconButton>
          </>
        }
      />

      {/* チャットリスト */}
      <main className="flex-1 overflow-y-auto bg-white">
        <ul className="divide-y divide-gray-100">
          {rooms.map((room) => {
            const last = room.messages[0];
            return (
              <li
                key={room.id}
                onClick={() => router.push(`/talk/${room.id}`)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                  style={{ backgroundColor: "var(--line-green)" }}
                >
                  {room.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-sm text-gray-900 truncate">{room.name}</span>
                    {last && (
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {formatTime(last.sentAt)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 truncate block">{last?.content ?? ""}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </main>

      {/* ボトムナビゲーション */}
      <nav className="flex border-t border-gray-200 bg-white flex-shrink-0" style={{ height: 56 }}>
        {NAV_TABS.map((tab) => (
          <button
            key={tab.label}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
            style={{ color: tab.active ? "var(--line-green)" : "#999" }}
          >
            {tab.icon}
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </nav>
    </AppShell>
  );
}
