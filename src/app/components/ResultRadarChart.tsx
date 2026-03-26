"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import type { TypeDescription, TypeId } from "@/lib/surveyData";

type Props = {
  scoresByType: Record<TypeId, number>;
  types: TypeDescription[];
  maxScore?: number;
};

// 🌟 축(Axis) 텍스트를 '이름 + 점수' 두 줄로 만들어주는 컴포넌트
const CustomTick = (props: any) => {
  const { x, y, payload, textAnchor, data } = props;
  
  // 현재 꼭짓점의 이름(payload.value)과 일치하는 데이터에서 점수를 가져옵니다.
  const currentData = data.find((d: any) => d.subject === payload.value);
  const score = currentData ? currentData.score : 0;

  return (
    // 꼭짓점 바깥쪽 위치(x, y)를 기준으로 텍스트를 배치합니다.
    <g transform={`translate(${x},${y})`}>
      {/* 1. 첫 번째 줄: 유형 이름 */}
      <text textAnchor={textAnchor} fill="#4b5563" fontSize={14} fontWeight="bold" dy={0}>
        {payload.value}
      </text>
      {/* 2. 두 번째 줄: 유형 점수 (dy=18을 줘서 아랫줄로 내림) */}
      <text textAnchor={textAnchor} fill="#4b5563" fontSize={12} fontWeight="900" dy={13}>
        {score}
      </text>
    </g>
  );
};

export default function ResultRadarChart({ scoresByType, types, maxScore = 24 }: Props) {
  const data = types.map((t) => ({
    subject: t.name,
    score: scoresByType[t.typeId] || 0,
    fullMark: maxScore,
  }));

  return (
    <div className="h-72 w-full sm:h-80">
      {/* 저번에 추가한 minWidth={0}으로 에러도 방지합니다 */}
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={undefined}>
        <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
          <PolarGrid strokeOpacity={0.3} />
          
          {/* 🌟 기존의 단순 텍스트 대신 두 줄짜리 CustomTick을 적용합니다 */}
          <PolarAngleAxis 
            dataKey="subject" 
            tick={(props) => <CustomTick {...props} data={data} />}
          />
          
          <PolarRadiusAxis angle={30} domain={[0, maxScore]} tick={false} axisLine={false} />
          
          <Radar
            name="점수"
            dataKey="score"
            stroke="#4f46e5"
            strokeWidth={2}
            fill="#6366f1"
            fillOpacity={0.4}
            // 안쪽 꼭짓점에 있던 점과 라벨은 지저분해서 완전히 없앴습니다.
          />
          
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}