"use client";

import Image from "next/image";
import type { TypeDescription, TypeId } from "@/lib/surveyData";

export type TypeDescriptionPanelProps = {
  selectedType: TypeDescription | null;
  onClear?: () => void;
  // When null is displayed, the panel can show hint text.
  hint?: string;
  onSelectTypeId?: (typeId: TypeId) => void;
};

export default function TypeDescriptionPanel({
  selectedType,
  hint = "유형 카드를 클릭하면 설명이 표시됩니다.",
}: TypeDescriptionPanelProps) {
  if (!selectedType) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
        <div className="text-sm font-semibold text-black/80 dark:text-white/80">유형 설명</div>
        <div className="mt-2 text-sm text-black/60 dark:text-white/60">{hint}</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-black/80 dark:text-white/80">{selectedType.name}</div>
      </div>
      
      <pre className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-black/80 dark:text-white/80">
        {selectedType.description}
      </pre>
    </div>
  );
}

