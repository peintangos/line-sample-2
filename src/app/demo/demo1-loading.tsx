"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChatFrame,
  BotMessage,
  UserMessage,
  LoadingBubble,
  FlexCard,
  Timestamp,
} from "./line-chat";

type Step =
  | { type: "timestamp"; time: string }
  | { type: "user"; text: string }
  | { type: "loading" }
  | { type: "flex-result" }
  | { type: "bot"; text: string };

const scenario: { step: Step; delay: number }[] = [
  { step: { type: "timestamp", time: "14:32" }, delay: 500 },
  { step: { type: "user", text: "渋谷でおすすめのランチある？" }, delay: 800 },
  { step: { type: "loading" }, delay: 600 },
  { step: { type: "flex-result" }, delay: 3000 },
];

export function Demo1Loading() {
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
          } else if (step.type === "flex-result") {
            setShowLoading(false);
            setVisibleSteps((prev) => [...prev, step]);
          } else {
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
      <ChatFrame title="AI グルメ Bot">
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
            case "flex-result":
              return (
                <FlexCard key={i} animate>
                  <div className="p-0">
                    <div className="bg-gradient-to-r from-orange-400 to-red-400 px-4 py-3">
                      <p className="text-white font-bold text-base">
                        🍽️ 渋谷ランチ おすすめ3選
                      </p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <div className="px-4 py-3">
                        <p className="font-bold text-sm text-gray-800">
                          1. AFURI 渋谷
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          柚子塩らーめん ¥1,080
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-400 text-xs">
                            ★★★★☆
                          </span>
                          <span className="text-xs text-gray-400">4.2</span>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <p className="font-bold text-sm text-gray-800">
                          2. やまちゃん
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          特製牛タン定食 ¥1,500
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-400 text-xs">
                            ★★★★★
                          </span>
                          <span className="text-xs text-gray-400">4.7</span>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <p className="font-bold text-sm text-gray-800">
                          3. 鳥竹
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          焼き鳥丼 ¥900
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-400 text-xs">
                            ★★★★☆
                          </span>
                          <span className="text-xs text-gray-400">4.0</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="bg-[#06C755] text-white text-center py-2 rounded-lg text-sm font-bold">
                        📍 地図で見る
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
