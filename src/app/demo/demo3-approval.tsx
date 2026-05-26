"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChatFrame,
  BotMessage,
  UserMessage,
  LoadingBubble,
  FlexCard,
  QuickReplies,
  Timestamp,
} from "./line-chat";

type Step =
  | { type: "timestamp"; time: string }
  | { type: "user"; text: string }
  | { type: "bot"; text: string }
  | { type: "loading" }
  | { type: "flex-proposal" }
  | { type: "quick-reply"; options: string[] }
  | { type: "flex-confirmed" };

const scenario: { step: Step; delay: number }[] = [
  { step: { type: "timestamp", time: "09:45" }, delay: 500 },
  {
    step: { type: "user", text: "明日の14時にミーティング入れて" },
    delay: 800,
  },
  { step: { type: "loading" }, delay: 600 },
  { step: { type: "flex-proposal" }, delay: 2500 },
  {
    step: {
      type: "quick-reply",
      options: ["承認する", "時間を変更", "キャンセル"],
    },
    delay: 300,
  },
];

const afterApproval: { step: Step; delay: number }[] = [
  { step: { type: "user", text: "承認する" }, delay: 0 },
  { step: { type: "loading" }, delay: 600 },
  { step: { type: "flex-confirmed" }, delay: 2000 },
];

export function Demo3Approval() {
  const [visibleSteps, setVisibleSteps] = useState<Step[]>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showQuickReply, setShowQuickReply] = useState(false);
  const [quickReplyOptions, setQuickReplyOptions] = useState<string[]>([]);
  const [approved, setApproved] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const runAnimation = useCallback(() => {
    setVisibleSteps([]);
    setShowLoading(false);
    setShowQuickReply(false);
    setQuickReplyOptions([]);
    setApproved(false);

    let totalDelay = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    for (const { step, delay } of scenario) {
      totalDelay += delay;
      const d = totalDelay;
      timeouts.push(
        setTimeout(() => {
          if (step.type === "loading") {
            setShowLoading(true);
          } else if (step.type === "quick-reply") {
            setShowQuickReply(true);
            setQuickReplyOptions(step.options);
          } else {
            setShowLoading(false);
            setVisibleSteps((prev) => [...prev, step]);
          }
        }, d)
      );
    }

    // Auto-approve after a pause
    totalDelay += 2000;
    timeouts.push(
      setTimeout(() => {
        setApproved(true);
        setShowQuickReply(false);

        let innerDelay = 0;
        for (const { step, delay } of afterApproval) {
          innerDelay += delay;
          const d2 = innerDelay;
          timeouts.push(
            setTimeout(() => {
              if (step.type === "loading") {
                setShowLoading(true);
              } else {
                setShowLoading(false);
                setVisibleSteps((prev) => [...prev, step]);
              }
            }, d2)
          );
        }
      }, totalDelay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const cleanup = runAnimation();
    return cleanup;
  }, [runAnimation, replayKey]);

  return (
    <div className="flex flex-col items-center gap-4">
      <ChatFrame title="AI スケジュール Bot">
        {visibleSteps.map((step, i) => {
          switch (step.type) {
            case "timestamp":
              return <Timestamp key={i} time={step.time} />;
            case "user":
              return (
                <UserMessage key={i} animate>
                  {step.text}
                </UserMessage>
              );
            case "bot":
              return (
                <BotMessage key={i} animate>
                  {step.text}
                </BotMessage>
              );
            case "flex-proposal":
              return (
                <FlexCard key={i} animate>
                  <div>
                    <div className="bg-gradient-to-r from-purple-500 to-violet-500 px-4 py-3">
                      <p className="text-white font-bold text-sm">
                        📅 ミーティング登録 — 確認
                      </p>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">タイトル</span>
                        <span className="font-bold text-gray-800">
                          ミーティング
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">日時</span>
                        <span className="text-gray-800">
                          5/27 (火) 14:00–15:00
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">場所</span>
                        <span className="text-gray-800">
                          会議室 A
                        </span>
                      </div>
                    </div>
                    <div className="px-4 pb-3">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                        <p className="text-xs text-yellow-700">
                          ⚠️ この操作を実行してよろしいですか？
                        </p>
                      </div>
                    </div>
                  </div>
                </FlexCard>
              );
            case "flex-confirmed":
              return (
                <FlexCard key={i} animate>
                  <div>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3">
                      <p className="text-white font-bold text-sm">
                        ✅ 登録完了
                      </p>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">タイトル</span>
                        <span className="font-bold text-gray-800">
                          ミーティング
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">日時</span>
                        <span className="text-gray-800">
                          5/27 (火) 14:00–15:00
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">ステータス</span>
                        <span className="text-green-600 font-bold">
                          確定済み ✅
                        </span>
                      </div>
                    </div>
                    <div className="px-4 pb-3">
                      <div className="bg-[#06C755] text-white text-center py-2 rounded-lg text-sm font-bold">
                        📅 カレンダーで確認
                      </div>
                    </div>
                  </div>
                </FlexCard>
              );
            default:
              return null;
          }
        })}
        {showLoading && <LoadingBubble animate />}
        {showQuickReply && !approved && (
          <QuickReplies options={quickReplyOptions} animate />
        )}
      </ChatFrame>
      <button
        onClick={() => setReplayKey((k) => k + 1)}
        className="px-6 py-2 bg-[#06C755] text-white rounded-full text-sm font-bold hover:bg-[#05a847] transition-colors"
      >
        ▶ リプレイ
      </button>
    </div>
  );
}
