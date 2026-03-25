import { SURVEY_QUESTIONS, type PointValue, type TypeId } from "./surveyData";

export type AnswersMap = Record<number, PointValue>; // questionId -> point(1..4)

export type TypeScore = {
  typeId: TypeId;
  score: number;
};

export type ComputeResultsResult = {
  scoresByType: Record<TypeId, number>;
  top2TypeIds: TypeId[]; // highest 2 (ties truncated by typeId asc)
  bottom2TypeIds: TypeId[]; // lowest 2 (ties truncated by typeId asc)
  allTypeScores: TypeScore[]; // length 8, unsorted (or sorted by typeId)
};

export function computeResults(answers: AnswersMap): ComputeResultsResult {
  const scoresByType: Record<TypeId, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };

  for (const q of SURVEY_QUESTIONS) {
    const p = answers[q.questionId];
    if (p === undefined) {
      throw new Error(`Missing answer for questionId=${q.questionId}`);
    }
    scoresByType[q.typeId] += p;
  }

  const allTypeScores: TypeScore[] = ([1, 2, 3, 4, 5, 6, 7, 8] as TypeId[]).map((typeId) => ({
    typeId,
    score: scoresByType[typeId],
  }));

  const top2TypeIds = [...allTypeScores]
    .sort((a, b) => b.score - a.score || a.typeId - b.typeId)
    .slice(0, 2)
    .map((x) => x.typeId);

  const bottom2TypeIds = [...allTypeScores]
    .sort((a, b) => a.score - b.score || a.typeId - b.typeId)
    .slice(0, 2)
    .map((x) => x.typeId);

  return { scoresByType, top2TypeIds, bottom2TypeIds, allTypeScores };
}

