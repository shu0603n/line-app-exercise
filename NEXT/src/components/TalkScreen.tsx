"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ChatRoom, Message } from "@/generated/prisma/models";
import AppShell from "./AppShell";
import AppHeader, { HeaderIconButton } from "./AppHeader";

interface Props {
  room: ChatRoom;
  initialMessages: Message[];
}

function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(date: Date | string) {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "今日";
  if (diffDays === 1) return "昨日";
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function isSameDay(a: Date | string, b: Date | string) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

export default function TalkScreen({ room, initialMessages }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const content = input.trim();
    if (!content || sending) return;
    setSending(true);
    setInput("");

    const optimistic: Message = {
      id: Date.now(),
      roomId: room.id,
      senderName: "自分",
      content,
      isMine: true,
      sentAt: new Date(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch(`/api/rooms/${room.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const saved: Message = await res.json();
        setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? saved : m)));
      }
    } catch {
      // 楽観的更新済みのため何もしない
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <AppShell>
      <AppHeader
        left={
          <HeaderIconButton label="戻る" onClick={() => router.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </HeaderIconButton>
        }
        center={
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: "var(--line-green-dark)" }}
            >
              {room.avatar}
            </div>
            <span className="font-bold text-sm truncate">{room.name}</span>
          </div>
        }
        right={
          <>
            <HeaderIconButton label="音声通話">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </HeaderIconButton>
            <HeaderIconButton label="メニュー">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </HeaderIconButton>
          </>
        }
      />

      {/* メッセージエリア */}
      <main
        className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1"
        style={{ backgroundColor: "#d4edda" }}
      >
        {messages.map((msg, i) => {
          const showDateLabel = i === 0 || !isSameDay(messages[i - 1].sentAt, msg.sentAt);
          const prevMsg = i > 0 ? messages[i - 1] : null;
          const nextMsg = i < messages.length - 1 ? messages[i + 1] : null;
          const isFirst = !prevMsg || prevMsg.senderName !== msg.senderName;
          const isLast = !nextMsg || nextMsg.senderName !== msg.senderName;

          return (
            <div key={msg.id}>
              {showDateLabel && (
                <div className="flex justify-center my-3">
                  <span className="text-xs text-gray-600 bg-white/60 rounded-full px-3 py-1">
                    {formatDateLabel(msg.sentAt)}
                  </span>
                </div>
              )}
              <div className={`flex items-end gap-2 mb-0.5 ${msg.isMine ? "flex-row-reverse" : "flex-row"}`}>
                {!msg.isMine && (
                  <div className="w-8 flex-shrink-0 self-end">
                    {isLast && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: "var(--line-green)" }}
                      >
                        {room.avatar}
                      </div>
                    )}
                  </div>
                )}
                <div className={`flex flex-col max-w-[72%] ${msg.isMine ? "items-end" : "items-start"}`}>
                  {!msg.isMine && isFirst && (
                    <span className="text-xs text-gray-600 mb-1 ml-1">{msg.senderName}</span>
                  )}
                  <div className={`flex items-end gap-1 ${msg.isMine ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                        msg.isMine
                          ? "text-white rounded-br-sm"
                          : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                      }`}
                      style={msg.isMine ? { backgroundColor: "var(--line-green)" } : {}}
                    >
                      {msg.content}
                    </div>
                    {isLast && (
                      <span className="text-xs text-gray-500 flex-shrink-0 mb-0.5">
                        {formatTime(msg.sentAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </main>

      {/* 入力エリア */}
      <footer className="flex items-end gap-2 px-3 py-2 bg-white border-t border-gray-200 flex-shrink-0">
        <button aria-label="スタンプ" className="w-9 h-9 flex items-center justify-center text-gray-400 flex-shrink-0 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
          </svg>
        </button>

        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力"
          rows={1}
          className="flex-1 resize-none rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-green-400 bg-gray-50 max-h-28 overflow-y-auto"
          style={{ lineHeight: "1.5" }}
        />

        <button aria-label="カメラ" className="w-9 h-9 flex items-center justify-center text-gray-400 flex-shrink-0 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>
        </button>

        <button
          onClick={sendMessage}
          disabled={!input.trim() || sending}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-all flex-shrink-0 disabled:opacity-40"
          style={{ backgroundColor: input.trim() ? "var(--line-green)" : "#ccc" }}
          aria-label="送信"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
            <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
          </svg>
        </button>
      </footer>
    </AppShell>
  );
}
