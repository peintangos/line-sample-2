"use client";

import { ReactNode, useEffect, useRef } from "react";

export function ChatFrame({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  return (
    <div className="w-[375px] h-[700px] rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-[#7AADCA]">
      {/* Header */}
      <div className="bg-[#7AADCA] text-white px-4 py-3 flex items-center gap-3">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="text-lg font-bold flex-1 text-center pr-6">
          {title}
        </span>
      </div>
      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3 bg-[#7AADCA]"
      >
        {children}
      </div>
    </div>
  );
}

export function BotMessage({
  children,
  sender,
  avatar,
  animate,
}: {
  children: ReactNode;
  sender?: string;
  avatar?: string;
  animate?: boolean;
}) {
  return (
    <div
      className={`flex gap-2 items-end ${animate ? "animate-fade-in-up" : ""}`}
    >
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shrink-0 overflow-hidden">
        {avatar ? (
          <span className="text-2xl">{avatar}</span>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
      </div>
      <div className="flex flex-col gap-1 max-w-[260px]">
        {sender && (
          <span className="text-xs text-white/80 ml-1">{sender}</span>
        )}
        <div className="bg-white rounded-2xl rounded-bl-sm px-3 py-2 text-sm text-gray-800 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

export function UserMessage({
  children,
  animate,
}: {
  children: ReactNode;
  animate?: boolean;
}) {
  return (
    <div
      className={`flex justify-end ${animate ? "animate-fade-in-up" : ""}`}
    >
      <div className="bg-[#06C755] text-white rounded-2xl rounded-br-sm px-3 py-2 text-sm max-w-[260px] shadow-sm">
        {children}
      </div>
    </div>
  );
}

export function UserImageMessage({
  src,
  animate,
}: {
  src: string;
  animate?: boolean;
}) {
  return (
    <div
      className={`flex justify-end ${animate ? "animate-fade-in-up" : ""}`}
    >
      <div className="rounded-2xl rounded-br-sm overflow-hidden shadow-sm max-w-[200px]">
        <img src={src} alt="" className="w-full h-auto block" />
      </div>
    </div>
  );
}

export function LoadingBubble({ animate }: { animate?: boolean }) {
  return (
    <div
      className={`flex gap-2 items-end ${animate ? "animate-fade-in-up" : ""}`}
    >
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shrink-0">
        <span className="text-2xl">🤖</span>
      </div>
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5">
          <div
            className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

export function QuickReplies({
  options,
  onSelect,
  animate,
}: {
  options: string[];
  onSelect?: (option: string) => void;
  animate?: boolean;
}) {
  return (
    <div
      className={`flex gap-2 overflow-x-auto pb-1 px-1 ${animate ? "animate-fade-in-up" : ""}`}
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect?.(opt)}
          className="shrink-0 px-4 py-2 rounded-full border-2 border-[#06C755] text-[#06C755] bg-white text-sm font-bold hover:bg-[#06C755] hover:text-white transition-colors"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function FlexCard({
  children,
  animate,
}: {
  children: ReactNode;
  animate?: boolean;
}) {
  return (
    <div
      className={`flex gap-2 items-end ${animate ? "animate-fade-in-up" : ""}`}
    >
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shrink-0">
        <span className="text-2xl">🤖</span>
      </div>
      <div className="bg-white rounded-2xl rounded-bl-sm overflow-hidden shadow-sm max-w-[280px]">
        {children}
      </div>
    </div>
  );
}

export function FlexCardWithSender({
  children,
  sender,
  avatar,
  animate,
}: {
  children: ReactNode;
  sender?: string;
  avatar?: string;
  animate?: boolean;
}) {
  return (
    <div
      className={`flex gap-2 items-end ${animate ? "animate-fade-in-up" : ""}`}
    >
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shrink-0 overflow-hidden">
        {avatar ? (
          <span className="text-2xl">{avatar}</span>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
      </div>
      <div className="flex flex-col gap-1 max-w-[280px]">
        {sender && (
          <span className="text-xs text-white/80 ml-1">{sender}</span>
        )}
        <div className="bg-white rounded-2xl rounded-bl-sm overflow-hidden shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Timestamp({ time }: { time: string }) {
  return (
    <div className="text-center text-xs text-white/70 my-2">{time}</div>
  );
}
