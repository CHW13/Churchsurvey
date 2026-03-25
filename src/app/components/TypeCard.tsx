"use client";

import type { TypeId } from "@/lib/surveyData";

export type TypeCardProps = {
  typeId: TypeId;
  name: string;
  score: number;
  maxScore?: number; // 게이지 바 계산을 위한 최대 점수 (기본값 24)
  badge?: string;
  selected?: boolean;
  onSelect: (typeId: TypeId) => void;
};

export default function TypeCard({
  typeId,
  name,
  score,
  maxScore = 24, // 한 유형당 만점이 몇 점인지 여기에 적어주세요 (예: 6문항 * 4점 = 24점)
  badge,
  selected,
  onSelect,
}: TypeCardProps) {
  // '상위', '하위' 글자만 포함되어 있으면 숫자에 상관없이 색상을 적용하도록 간소화
  const badgeClass = badge?.includes("상위")
    ? "bg-indigo-600 text-white"
    : badge?.includes("하위")
      ? "bg-rose-600 text-white"
      : "bg-black/5 text-black dark:bg-white/10 dark:text-white";

  // 게이지 바 퍼센트 계산 (최대 100%)
  const percent = Math.min((score / maxScore) * 100, 100);

  return (
    <button
      type="button"
      onClick={() => onSelect(typeId)}
      className={[
        "flex w-full flex-col rounded-2xl border px-4 py-3 text-left transition",
        "bg-white/70 shadow-sm backdrop-blur hover:shadow-md",
        "hover:bg-white/90 dark:bg-white/5 dark:hover:bg-white/10",
        selected
          ? "border-indigo-500/60 ring-2 ring-indigo-500/25 dark:border-indigo-400/60"
          : "border-black/10 dark:border-white/10",
      ].join(" ")}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-black dark:text-white">{name}</div>
          {badge ? (
            <div
              className={[
                "mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                badgeClass,
              ].join(" ")}
            >
              {badge}
            </div>
          ) : null}
        </div>
        <div className="text-right">
          <div className="text-xs text-black/60 dark:text-white/60">합산</div>
          <div className="text-lg font-bold text-black dark:text-white">{score}</div>
        </div>
      </div>

      {/* 1. 새로 추가된 점수 게이지 바 */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <div
          className={[
            "h-full rounded-full transition-all duration-700 ease-out",
            badge?.includes("하위") ? "bg-rose-500" : "bg-indigo-500", // 하위 유형은 붉은색, 나머지는 푸른색
          ].join(" ")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </button>
  );
}