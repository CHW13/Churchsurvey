export type TypeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type PointValue = 1 | 2 | 3 | 4;

export type SurveyQuestion = {
  questionId: number; // 1..48
  typeId: TypeId; // 1..8
  text: string;
};

export type TypeDescription = {
  typeId: TypeId;
  name: string;
  description: string;
  imageUrl: string;
};

export const TYPES: TypeDescription[] = [
  {
    typeId: 1,
    name: "유형 1",
    imageUrl: "/type-1.svg",
    description: `핵심 성향 6가지
1. 섬김 지향성 – 앞서기보다 먼저 낮아지려는 태도
2. 책임감 – 맡겨진 영혼을 끝까지 돌보려는 의지
3. 인내력 – 학생의 성장 과정을 기다릴 수 있음
4. 비전 제시 능력 – 학생을 그리스도의 성숙으로 이끄는 방향성
5. 희생정신 – 자신의 편안함보다 학생을 우선함
6. 영적 영향력 – 말보다 삶으로 영향 주는 힘`,
  },
  {
    typeId: 2,
    name: "유형 2",
    imageUrl: "/type-2.svg",
    description: `핵심 성향 6가지
1. 모범성 – 삶으로 보여주려는 태도
2. 관계 지향성 – 깊은 신뢰와 친밀감 형성
3. 진정성 – 꾸밈없는 삶과 일관성
4. 격려 능력 – 학생의 가능성을 발견하고 세워줌
5. 책임 공유 의식 – 함께 성장하려는 자세
6. 개별성 존중 – 학생 한 사람의 독특함을 인정`,
  },
  {
    typeId: 3,
    name: "유형 3",
    imageUrl: "/type-3.svg",
    description: `핵심 성향 6가지
1. 질문 중심 사고 – 답보다 질문을 중요시함
2. 인내적 기다림 – 학생이 스스로 깨닫도록 기다림
3. 촉진자 역할 인식 – 주인공이 아닌 조력자로 서려는 태도
4. 창의성 존중 – 다양한 생각을 열어둠
5. 분석적 사고 – 학생의 생각을 잘 이끌어냄
6. 개방성 – 정답을 강요하지 않는 태도`,
  },
  {
    typeId: 4,
    name: "유형 4",
    imageUrl: "/type-4.svg",
    description: `핵심 성향 6가지
1. 경청 능력 – 말보다 듣는 데 집중
2. 공감력 – 학생의 감정을 이해하려는 태도
3. 명확한 표현력 – 쉽게 전달하는 능력
4. 상호작용 지향성 – 일방향이 아닌 쌍방향 소통
5. 유연성 – 상황에 따라 소통 방식 조절
6. 개방적 태도 – 다양한 의견을 수용`,
  },
  {
    typeId: 5,
    name: "유형 5",
    imageUrl: "/type-5.svg",
    description: `핵심 성향 6가지
1. 상상력 – 이미지와 장면을 그려내는 능력
2. 표현력 – 말과 감정 전달이 풍부함
3. 감성 자극 능력 – 마음을 움직이는 힘
4. 창의성 – 다양한 이야기 방식 활용
5. 열정 – 전달에 생동감이 있음
6. 상징 이해력 – 은유와 이미지 활용 능력`,
  },
  {
    typeId: 6,
    name: "유형 6",
    imageUrl: "/type-6.svg",
    description: `핵심 성향 6가지
1. 공감 능력 – 학생의 감정을 깊이 이해
2. 경청 태도 – 판단 없이 들어주는 자세
3. 인내심 – 문제 해결을 서두르지 않음
4. 신뢰 형성 능력 – 안전한 관계를 만듦
5. 분석력 – 문제의 원인을 파악하는 능력
6. 따뜻함 – 정서적으로 안정감을 주는 성향`,
  },
  {
    typeId: 7,
    name: "유형 7",
    imageUrl: "/type-7.svg",
    description: `핵심 성향 6가지
1. 비판적 사고 – 현실을 분석하고 질문하는 능력
2. 정의감 – 옳고 그름에 민감함
3. 통찰력 – 시대와 상황을 읽는 눈
4. 용기 – 기존 틀을 깨는 태도
5. 학생 존중 – 학생을 주체로 인정
6. 변화 지향성 – 더 나은 삶을 향한 방향 제시`,
  },
  {
    typeId: 8,
    name: "유형 8",
    imageUrl: "/type-8.svg",
    description: `핵심 성향 6가지
1. 겸손 – 자신도 배우는 존재라는 인식
2. 자기 점검 능력 – 자신의 말과 행동을 돌아봄
3. 수용성 – 비판을 받아들이는 태도
4. 학습 지속성 – 계속 배우려는 자세
5. 객관성 – 자신을 거리 두고 바라봄
6. 개선 의지 – 더 나아지려는 노력`,
  },
];

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  // 1~6 (리더형)
  { questionId: 1, typeId: 1, text: "나는 학생을 섬기는 마음으로 이끌려고 한다" },
  { questionId: 2, typeId: 1, text: "학생의 필요를 먼저 파악하려 노력한다" },
  { questionId: 3, typeId: 1, text: "어려움 속에서도 끝까지 책임을 다하려 한다" },
  { questionId: 4, typeId: 1, text: "학생을 바른 방향으로 인도해야 한다는 사명감이 있다" },
  { questionId: 5, typeId: 1, text: "나의 행동이 학생에게 영향을 준다고 생각한다" },
  { questionId: 6, typeId: 1, text: "공동체를 위해 희생하는 것이 중요하다고 생각한다" },

  // 7~12 (멘토형)
  { questionId: 7, typeId: 2, text: "나는 학생에게 삶으로 본을 보이려 노력한다" },
  { questionId: 8, typeId: 2, text: "학생과 깊은 신뢰 관계를 맺는 것이 중요하다고 생각한다" },
  { questionId: 9, typeId: 2, text: "학생의 가능성을 발견하고 격려하는 편이다" },
  { questionId: 10, typeId: 2, text: "학생 한 사람 한 사람을 소중히 여긴다" },
  { questionId: 11, typeId: 2, text: "학생과 함께 성장하는 관계를 중요하게 생각한다" },
  { questionId: 12, typeId: 2, text: "나의 말과 행동이 일치하려고 노력한다" },

  // 13~18 (산파형)
  { questionId: 13, typeId: 3, text: "나는 학생에게 답보다 질문을 더 많이 던진다" },
  { questionId: 14, typeId: 3, text: "학생이 스스로 깨닫도록 기다려준다" },
  { questionId: 15, typeId: 3, text: "다양한 생각을 존중하는 편이다" },
  { questionId: 16, typeId: 3, text: "정답을 바로 알려주기보다 생각하게 만든다" },
  { questionId: 17, typeId: 3, text: "학생의 생각을 끌어내는 것을 중요하게 여긴다" },
  { questionId: 18, typeId: 3, text: "수업에서 질문과 토론을 자주 활용한다" },

  // 19~24 (커뮤니케이터형)
  { questionId: 19, typeId: 4, text: "나는 학생의 말을 끝까지 잘 듣는 편이다" },
  { questionId: 20, typeId: 4, text: "학생과 대화하는 것이 자연스럽다" },
  { questionId: 21, typeId: 4, text: "수업 중 상호작용을 중요하게 생각한다" },
  { questionId: 22, typeId: 4, text: "학생의 감정과 반응을 잘 읽는 편이다" },
  { questionId: 23, typeId: 4, text: "다양한 의견을 수용하려고 한다" },
  { questionId: 24, typeId: 4, text: "소통이 잘 되는 분위기를 만들려고 노력한다" },

  // 25~30 (이야기꾼형)
  { questionId: 25, typeId: 5, text: "나는 이야기를 활용해 설명하는 것을 좋아한다" },
  { questionId: 26, typeId: 5, text: "감정을 담아 표현하는 편이다" },
  { questionId: 27, typeId: 5, text: "학생의 관심을 끄는 설명을 잘 하는 편이다" },
  { questionId: 28, typeId: 5, text: "비유나 예화를 자주 사용한다" },
  { questionId: 29, typeId: 5, text: "전달할 때 생동감 있게 말하려 한다" },
  { questionId: 30, typeId: 5, text: "학생이 몰입할 수 있도록 분위기를 만든다" },

  // 31~36 (상담가형)
  { questionId: 31, typeId: 6, text: "나는 학생의 고민을 잘 들어주는 편이다" },
  { questionId: 32, typeId: 6, text: "학생의 감정을 이해하려 노력한다" },
  { questionId: 33, typeId: 6, text: "문제 상황에서 쉽게 판단하지 않는다" },
  { questionId: 34, typeId: 6, text: "학생이 편하게 이야기할 수 있는 분위기를 만든다" },
  { questionId: 35, typeId: 6, text: "학생의 마음 상태를 중요하게 여긴다" },
  { questionId: 36, typeId: 6, text: "학생의 문제를 함께 고민하려 한다" },

  // 37~42 (해방자형)
  { questionId: 37, typeId: 7, text: "학생이 스스로 생각하도록 돕는 것이 중요하다고 생각한다" },
  { questionId: 38, typeId: 7, text: "세상과 삶에 대해 질문하도록 이끈다" },
  { questionId: 39, typeId: 7, text: "학생을 독립적인 존재로 존중한다" },
  { questionId: 40, typeId: 7, text: "학생이 자신의 삶을 주체적으로 살도록 돕고 싶다" },
  { questionId: 41, typeId: 7, text: "기존의 틀을 넘어 생각하도록 격려한다" },
  { questionId: 42, typeId: 7, text: "학생이 자신의 가치와 목적을 찾도록 돕는다" },

  // 43~48 (성찰자형)
  { questionId: 43, typeId: 8, text: "다른 사람의 피드백을 받아들이는 편이다" },
  { questionId: 44, typeId: 8, text: "계속 배우고 성장하려 노력한다" },
  { questionId: 45, typeId: 8, text: "더 나은 교사가 되기 위해 고민한다" },
  { questionId: 46, typeId: 8, text: "다양한 관점을 배우려고 노력한다" },
  { questionId: 47, typeId: 8, text: "나의 가르침이 옳은지 점검하는 편이다" },
  { questionId: 48, typeId: 8, text: "겸손한 자세로 배우려 한다." },
];

export const ANSWER_POINTS: PointValue[] = [1, 2, 3, 4];

