"use client";

import { useEffect, useMemo, useRef, useState,useCallback } from "react";
import TypeCard from "./components/TypeCard";
import TypeDescriptionPanel from "./components/TypeDescriptionPanel";
import { computeResults, type AnswersMap, type ComputeResultsResult } from "@/lib/computeResults";
import { TYPES, SURVEY_QUESTIONS, type PointValue, type TypeDescription, type TypeId } from "@/lib/surveyData";
import ResultRadarChart from "./components/ResultRadarChart";
import { toPng } from "html-to-image";

const POINT_OPTIONS: Array<{ value: PointValue; label: string }> = [
  { value: 4, label: "매우 그렇다" },
  { value: 3, label: "그렇다" },
  { value: 2, label: "보통이다" },
  { value: 1, label: "아니다" },
];

function shuffleArray<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Home() {
  const [answers, setAnswers] = useState<Record<number, PointValue | undefined>>({});
  const [result, setResult] = useState<ComputeResultsResult | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<TypeId | null>(null);
  // Hydration mismatch 방지: SSR/초기 렌더에서는 무작위 셔플을 하지 않습니다.
  const [questionFlow, setQuestionFlow] = useState(() => SURVEY_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [advancing, setAdvancing] = useState(false);
  const [advancePct, setAdvancePct] = useState(0);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const advancingRef = useRef(false);

  const totalQuestions = questionFlow.length;
  const currentQuestion = questionFlow[currentIndex]!;
  const currentAnswer = answers[currentQuestion.questionId];

  const answeredCount = useMemo(() => {
    return SURVEY_QUESTIONS.reduce((acc, q) => acc + (answers[q.questionId] !== undefined ? 1 : 0), 0);
  }, [answers]);

  const selectedType: TypeDescription | null = useMemo(() => {
    if (!selectedTypeId) return null;
    return TYPES.find((t) => t.typeId === selectedTypeId) ?? null;
  }, [selectedTypeId]);

  const topSet = useMemo(() => new Set(result?.top2TypeIds ?? []), [result]);
  const bottomSet = useMemo(() => new Set(result?.bottom2TypeIds ?? []), [result]);

  useEffect(() => {
    // React hydration mismatch 방지를 위해 셔플은 마운트 이후에만 수행합니다.
    queueMicrotask(() => {
      setQuestionFlow(shuffleArray(SURVEY_QUESTIONS));
      setCurrentIndex(0);
    });
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  function handleReset() {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    advancingRef.current = false;
    setAnswers({});
    setResult(null);
    setSelectedTypeId(null);
    setQuestionFlow(shuffleArray(SURVEY_QUESTIONS));
    setCurrentIndex(0);
    setAdvancing(false);
    setAdvancePct(0);
  }
  // 1. 차트 영역을 가리킬 레퍼런스 변수를 만듭니다.
const chartRef = useRef<HTMLDivElement>(null);

// 2. 이미지를 저장하는 함수를 정의합니다.
const handleSaveImage = useCallback(async () => {
  if (chartRef.current === null) {
    alert("차트를 불러오는 중 오류가 발생했습니다.");
    return;
  }

  try {
    // html-to-image 라이브러리를 사용해 DOM 요소를 PNG 데이터로 변환합니다.
    const dataUrl = await toPng(chartRef.current, {
      cacheBust: true, // 이미지 깨짐 방지
      backgroundColor: "#ffffff", // 저장되는 이미지의 배경색을 흰색으로 고정 (다크모드 사용자 고려)
      style: {
        padding: "0px", // 이미지 주위에 여백을 줘서 더 깔끔하게 저장
      },
    });

    // 가짜 <a> 태그를 만들어서 다운로드를 실행합니다.
    const link = document.createElement("a");
    // 오늘 날짜를 포함한 파일명을 만듭니다 (예: 교사유형결과_2023-10-27.png)
    const today = new Date().toISOString().slice(0, 10);
    link.download = `기독교 교사 유형 설문결과_${today}.png`;
    link.href = dataUrl;
    link.click(); // 다운로드 링크 강제 클릭
  } catch (err) {
    console.error("이미지 저장 실패:", err);
    alert("이미지 파일로 저장하는 데 실패했습니다.");
  }
}, [chartRef]);

  function handlePrev() {
    if (advancingRef.current) return;
    setCurrentIndex((i) => Math.max(0, i - 1));
  }

  function handleSelect(value: PointValue) {
    const qId = currentQuestion.questionId;
    const nextAnswers = { ...answers, [qId]: value };

    if (advancingRef.current) return;

    const currentIndexSnapshot = currentIndex;
    const isLast = currentIndexSnapshot === totalQuestions - 1;

    setAnswers(nextAnswers);

    advancingRef.current = true;
    setAdvancing(true);
    setAdvancePct(0);

    // 채우기 애니메이션이 CSS transition으로 동작하도록 1프레임 딜레이 후 값을 변경합니다.
    requestAnimationFrame(() => setAdvancePct(100));

    const timeout = setTimeout(() => {
      advancingRef.current = false;
      setAdvancing(false);
      setAdvancePct(0);

      if (isLast) {
        const answersMap: AnswersMap = SURVEY_QUESTIONS.reduce((acc, q) => {
          const p = nextAnswers[q.questionId];
          if (p === undefined) throw new Error(`Missing answer for questionId=${q.questionId}`);
          acc[q.questionId] = p;
          return acc;
        }, {} as AnswersMap);

        const computed = computeResults(answersMap);
        setResult(computed);
        setSelectedTypeId(computed.top2TypeIds[0] ?? null);
        return;
      }

      setCurrentIndex((i) => i + 1);
    }, 150);

    timersRef.current.push(timeout);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-cyan-50 to-white dark:from-black dark:via-zinc-900 dark:to-black">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-black dark:text-white">기독교 교사 유형 설문 (48문항)</h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            각 문항마다 `아니다(1점)` ~ `매우 그렇다(4점)` 중 하나를 선택해 주세요.
          </p>
        </header>

        {!result ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-black/70 dark:text-white/70">
                  진행: {answeredCount} / {totalQuestions}
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-fit rounded-xl border border-black/10 bg-white px-3 py-1.5 text-sm font-semibold text-black/70 shadow-sm hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                >
                  초기화
                </button>
              </div>

              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                  style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-xs font-semibold text-indigo-700/80 dark:text-indigo-300/80">
                    문항 {currentIndex + 1} / {totalQuestions}
                  </div>
                </div>

                <div className="mt-3 text-lg font-semibold leading-relaxed text-black dark:text-white">
                  {currentQuestion.text}
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {POINT_OPTIONS.map((opt) => {
                    const selected = currentAnswer === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={[
                          "group cursor-pointer rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                          advancing ? "pointer-events-none opacity-80" : "",
                          selected
                            ? "border-indigo-500/60 bg-indigo-600 text-white shadow-md"
                            : "border-black/10 bg-white/70 text-black/80 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10",
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name={`q-${currentQuestion.questionId}`}
                          value={opt.value}
                          checked={currentAnswer === opt.value}
                          onChange={() => handleSelect(opt.value)}
                          onClick={() => handleSelect(opt.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between gap-3">
                          <span>{opt.label}</span>
                          <span className={selected ? "text-white/90" : "text-black/50 dark:text-white/50"}>
                            {opt.value}점
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentIndex === 0 || advancing}
                    className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black/70 shadow-sm disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
                  >
                    이전
                  </button>

                  {!advancing && currentIndex === totalQuestions - 1 && (
                    <div className="text-xs text-black/50 dark:text-white/50">
                      마지막 문항입니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div>
              <div className="mb-5 rounded-3xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="text-sm font-semibold text-black/80 dark:text-white/80">점수 상위/하위 2개 유형</div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-black/60 dark:text-white/60">상위 2개</div>
                    <div className="mt-2 space-y-3">
                      {/* 수정된 부분 1: 상위 유형 맵핑 (index 사용) */}
                      {result.top2TypeIds.map((typeId, index) => {
                        const t = TYPES.find((x) => x.typeId === typeId);
                        if (!t) return null;
                        return (
                          <TypeCard
                            key={typeId}
                            typeId={typeId}
                            name={t.name}
                            score={result.scoresByType[typeId]}
                            badge={`상위 ${index + 1}`} // "상위 1", "상위 2"로 표시됨
                            selected={selectedTypeId === typeId}
                            onSelect={setSelectedTypeId}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-black/60 dark:text-white/60">하위 2개</div>
                    <div className="mt-2 space-y-3">
                      {/* 수정된 부분 2: 하위 유형 맵핑 (index 사용) */}
                      {result.bottom2TypeIds.map((typeId, index) => {
                        const t = TYPES.find((x) => x.typeId === typeId);
                        if (!t) return null;
                        return (
                          <TypeCard
                            key={typeId}
                            typeId={typeId}
                            name={t.name}
                            score={result.scoresByType[typeId]}
                            badge={`하위 ${index + 1}`} // "하위 1", "하위 2"로 표시됨
                            selected={selectedTypeId === typeId}
                            onSelect={setSelectedTypeId}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>


              <div className="rounded-3xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="text-sm font-semibold text-black/80 dark:text-white/80">결과 한눈에 보기</div>
                
              
                <div className="mt-4" ref={chartRef}>
                  <ResultRadarChart 
                    scoresByType={result.scoresByType} 
                    types={TYPES} 
                    maxScore={24} 
                  />
                </div>
                  <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleSaveImage} // 위에서 만든 저장 함수 연결
                    className="flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900 transition-colors"
                  >
                    {/* 카메라 아이콘 (SVG) */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                    결과 이미지 저장하기
                  </button>
 

                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black/70 shadow-sm hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
                  >
                    다시하기
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">

                <div className="text-sm font-semibold text-black/80 dark:text-white/80">결과 자세히 보기</div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                  {/* 점수 내림차순 정렬 + 동점자 가나다순 정렬 적용 */}

                  {[...TYPES]

                    .sort((a, b) => {

                      const scoreA = result.scoresByType[a.typeId];

                      const scoreB = result.scoresByType[b.typeId];



                      // 1. 점수가 다르면 점수 기준 내림차순

                      if (scoreA !== scoreB) {

                        return scoreB - scoreA;

                      }



                      // 2. 점수가 같으면 이름 기준 가나다순 (한국어 기준)

                      return a.name.localeCompare(b.name, "ko-KR");

                    })

                    .map((t) => {

                      const topIndex = result.top2TypeIds.indexOf(t.typeId);

                      const bottomIndex = result.bottom2TypeIds.indexOf(t.typeId);



                      let badgeStr;

                      if (topIndex !== -1) badgeStr = `상위 ${topIndex + 1}`;

                      else if (bottomIndex !== -1) badgeStr = `하위 ${bottomIndex + 1}`;



                      return (

                        <TypeCard

                          key={t.typeId}

                          typeId={t.typeId}

                          name={t.name}

                          score={result.scoresByType[t.typeId]}

                          badge={badgeStr}

                          selected={selectedTypeId === t.typeId}

                          onSelect={setSelectedTypeId}

                        />

                      );

                    })}

                </div>
                </div>
            </div>

            <TypeDescriptionPanel selectedType={selectedType} />
          </div>
        )}
      </div>
    </div>
  );
}