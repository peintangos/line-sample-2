"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChatFrame,
  BotMessage,
  UserImageMessage,
  LoadingBubble,
  FlexCardWithSender,
  Timestamp,
} from "./line-chat";

type Step =
  | { type: "timestamp"; time: string }
  | { type: "user-image" }
  | { type: "loading" }
  | { type: "bot-sender"; sender: string; avatar: string; text: string }
  | { type: "flex-analysis" }
  | { type: "flex-nutrition" };

const scenario: { step: Step; delay: number }[] = [
  { step: { type: "timestamp", time: "12:30" }, delay: 500 },
  { step: { type: "user-image" }, delay: 800 },
  { step: { type: "loading" }, delay: 600 },
  {
    step: {
      type: "bot-sender",
      sender: "📷 画像認識",
      avatar: "👁️",
      text: "料理の画像を受け取りました。分析しています...",
    },
    delay: 2000,
  },
  { step: { type: "loading" }, delay: 400 },
  { step: { type: "flex-analysis" }, delay: 2200 },
  { step: { type: "loading" }, delay: 400 },
  { step: { type: "flex-nutrition" }, delay: 2000 },
];

export function Demo4ImageSender() {
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
      <ChatFrame title="AI カロリー Bot">
        {visibleSteps.map((step, i) => {
          switch (step.type) {
            case "timestamp":
              return <Timestamp key={i} time={step.time} />;
            case "user-image":
              return (
                <UserImageMessage
                  key={i}
                  src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'><rect width='200' height='150' fill='%23f5f0e8'/><text x='100' y='60' text-anchor='middle' font-size='40'>🍛</text><text x='100' y='90' text-anchor='middle' font-size='12' fill='%23666'>カレーライス</text><text x='100' y='110' text-anchor='middle' font-size='10' fill='%23999'>撮影: 12:28</text></svg>"
                  animate
                />
              );
            case "bot-sender":
              return (
                <BotMessage
                  key={i}
                  sender={step.sender}
                  avatar={step.avatar}
                  animate
                >
                  {step.text}
                </BotMessage>
              );
            case "flex-analysis":
              return (
                <FlexCardWithSender
                  key={i}
                  sender="🔍 分析エンジン"
                  avatar="🧠"
                  animate
                >
                  <div>
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3">
                      <p className="text-white font-bold text-sm">
                        🍛 画像分析結果
                      </p>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">料理名</span>
                        <span className="font-bold text-gray-800">
                          チキンカレー
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">推定量</span>
                        <span className="text-gray-800">1人前（約350g）</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">信頼度</span>
                        <span className="text-green-600 font-bold">92%</span>
                      </div>
                    </div>
                  </div>
                </FlexCardWithSender>
              );
            case "flex-nutrition":
              return (
                <FlexCardWithSender
                  key={i}
                  sender="📊 栄養計算"
                  avatar="📊"
                  animate
                >
                  <div>
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-3">
                      <p className="text-white font-bold text-sm">
                        📊 栄養情報
                      </p>
                    </div>
                    <div className="px-4 py-3">
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">カロリー</span>
                            <span className="font-bold text-gray-800">
                              687 kcal
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-400 h-2 rounded-full"
                              style={{ width: "45%" }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-red-50 rounded-lg p-2">
                            <p className="text-xs text-gray-500">たんぱく質</p>
                            <p className="font-bold text-sm text-gray-800">
                              24g
                            </p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-2">
                            <p className="text-xs text-gray-500">脂質</p>
                            <p className="font-bold text-sm text-gray-800">
                              18g
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-2">
                            <p className="text-xs text-gray-500">炭水化物</p>
                            <p className="font-bold text-sm text-gray-800">
                              98g
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-3">
                      <div className="bg-[#06C755] text-white text-center py-2 rounded-lg text-sm font-bold">
                        📝 食事記録に追加
                      </div>
                    </div>
                  </div>
                </FlexCardWithSender>
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
