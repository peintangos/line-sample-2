"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChatFrame,
  UserMessage,
  LoadingBubble,
  FlexCard,
  Timestamp,
} from "./line-chat";

type Step =
  | { type: "timestamp"; time: string }
  | { type: "user"; text: string }
  | { type: "loading" }
  | { type: "flex-search" }
  | { type: "flex-booking" };

const scenario: { step: Step; delay: number }[] = [
  { step: { type: "timestamp", time: "10:15" }, delay: 500 },
  {
    step: { type: "user", text: "来週の金曜、2名でイタリアン予約したい" },
    delay: 800,
  },
  { step: { type: "loading" }, delay: 600 },
  { step: { type: "flex-search" }, delay: 2800 },
  {
    step: { type: "user", text: "2番目のお店でお願い！" },
    delay: 2000,
  },
  { step: { type: "loading" }, delay: 600 },
  { step: { type: "flex-booking" }, delay: 2500 },
];

export function Demo2FlexGen() {
  const [visibleSteps, setVisibleSteps] = useState<Step[]>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const runAnimation = useCallback(() => {
    setVisibleSteps([]);
    setShowLoading(false);

    let totalDelay = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    for (const { step, delay } of scenario) {
      totalDelay += delay;
      const d = totalDelay;
      timeouts.push(
        setTimeout(() => {
          if (step.type === "loading") {
            setShowLoading(true);
          } else {
            setShowLoading(false);
            setVisibleSteps((prev) => [...prev, step]);
          }
        }, d)
      );
    }

    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const cleanup = runAnimation();
    return cleanup;
  }, [runAnimation, replayKey]);

  return (
    <div className="flex flex-col items-center gap-4">
      <ChatFrame title="AI レストラン Bot">
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
            case "flex-search":
              return (
                <FlexCard key={i} animate>
                  <div>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3">
                      <p className="text-white font-bold text-sm">
                        🔍 検索結果: イタリアン（来週金曜・2名）
                      </p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <div className="px-4 py-3 flex gap-3 items-center">
                        <span className="text-2xl">🍝</span>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-800">
                            1. Trattoria Mano
                          </p>
                          <p className="text-xs text-gray-500">
                            恵比寿 · ¥5,000〜
                          </p>
                          <span className="text-xs text-green-600">
                            ◎ 空席あり
                          </span>
                        </div>
                      </div>
                      <div className="px-4 py-3 flex gap-3 items-center">
                        <span className="text-2xl">🍕</span>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-800">
                            2. Pizzeria Azzurri
                          </p>
                          <p className="text-xs text-gray-500">
                            渋谷 · ¥3,500〜
                          </p>
                          <span className="text-xs text-green-600">
                            ◎ 空席あり
                          </span>
                        </div>
                      </div>
                      <div className="px-4 py-3 flex gap-3 items-center">
                        <span className="text-2xl">🥩</span>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-800">
                            3. Osteria Bella
                          </p>
                          <p className="text-xs text-gray-500">
                            代官山 · ¥8,000〜
                          </p>
                          <span className="text-xs text-yellow-600">
                            △ 残りわずか
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </FlexCard>
              );
            case "flex-booking":
              return (
                <FlexCard key={i} animate>
                  <div>
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3">
                      <p className="text-white font-bold text-sm">
                        📋 予約確認
                      </p>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">店名</span>
                        <span className="font-bold text-gray-800">
                          Pizzeria Azzurri
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">日時</span>
                        <span className="text-gray-800">
                          6/6 (金) 19:00
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">人数</span>
                        <span className="text-gray-800">2名</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">予算目安</span>
                        <span className="text-gray-800">¥3,500〜 / 人</span>
                      </div>
                    </div>
                    <div className="px-4 pb-3 flex gap-2">
                      <div className="flex-1 bg-[#06C755] text-white text-center py-2 rounded-lg text-sm font-bold">
                        ✅ 予約する
                      </div>
                      <div className="flex-1 bg-gray-200 text-gray-600 text-center py-2 rounded-lg text-sm font-bold">
                        変更する
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
