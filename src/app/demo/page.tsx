"use client";

import { useState } from "react";
import { Demo1Loading } from "./demo1-loading";
import { Demo2FlexGen } from "./demo2-flex-gen";
import { Demo3Approval } from "./demo3-approval";
import { Demo4ImageSender } from "./demo4-image-sender";

const demos = [
  { id: 1, label: "① Loading + Flex", component: Demo1Loading },
  { id: 2, label: "② Flex 動的生成", component: Demo2FlexGen },
  { id: 3, label: "③ 承認フロー", component: Demo3Approval },
  { id: 4, label: "④ 画像 + sender", component: Demo4ImageSender },
] as const;

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState(1);
  const ActiveComponent = demos.find((d) => d.id === activeDemo)!.component;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
      <div className="flex gap-2 mb-6">
        {demos.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveDemo(d.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              activeDemo === d.id
                ? "bg-[#06C755] text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <ActiveComponent key={activeDemo} />
    </div>
  );
}
