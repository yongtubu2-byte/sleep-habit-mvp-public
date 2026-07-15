export type DomainId =
  | "rhythm"
  | "onset"
  | "maintenance"
  | "recovery"
  | "daytime"
  | "body"
  | "mind";

export type RiskId = "apnea" | "driving" | "depression" | "selfHarm";

export type Question = {
  id: string;
  domain: DomainId;
  text: string;
  options?: string[];
  hint?: string;
  risk?: RiskId;
  riskThreshold?: number;
};

export const clinic = {
  name: "안성경옥당한의원",
  doctor: "김성혁 원장",
  credential: "일본동양의학회 특별회원",
  books: [
    "『숙면하는 습관』",
    "『노인을 위한 의학은 있다 - 고령자진료의 바이블』",
  ],
  reservationUrl: "tel:031-651-7582",
  phone: "031-651-7582",
  notice:
    "본 서비스는 생활 습관 점검과 건강 정보 제공을 위한 도구이며, 의학적 진단이나 치료를 대신하지 않습니다.",
};

export const domains: Record<DomainId, { label: string; short: string }> = {
  rhythm: { label: "수면 리듬", short: "리듬" },
  onset: { label: "입면 준비", short: "입면" },
  maintenance: { label: "수면 유지", short: "유지" },
  recovery: { label: "아침 회복", short: "회복" },
  daytime: { label: "낮 시간", short: "낮" },
  body: { label: "몸과 환경", short: "환경" },
  mind: { label: "걱정과 각성", short: "마음" },
};

export const answerLabels = [
  "없다",
  "1~2일",
  "3~5일",
  "6일 이상",
];

export const questions: Question[] = [
  { id: "q01", domain: "rhythm", text: "최근 2주, 평일과 휴일의 기상 시간이 2시간 이상 차이 난 날", hint: "최근 2주를 기준으로 답해 주세요." },
  { id: "q02", domain: "rhythm", text: "최근 2주, 기상 후 1시간 안에 빛을 거의 보지 못한 날" },
  { id: "q03", domain: "onset", text: "최근 2주, 누운 뒤 잠들기까지 30분 이상 걸린 날" },
  { id: "q04", domain: "onset", text: "최근 2주, 잠들기 1시간 전까지 스마트폰·영상을 본 날" },
  { id: "q05", domain: "maintenance", text: "최근 2주, 밤중에 2회 이상 깬 날" },
  { id: "q06", domain: "recovery", text: "최근 2주, 충분히 잔 것 같은데도 아침에 개운하지 않은 날" },
  { id: "q07", domain: "body", text: "최근 2주, 통증·열감·야간뇨·침실 환경 때문에 잠이 끊긴 날" },
  { id: "q08", domain: "mind", text: "최근 2주, 누우면 걱정이나 수면 불안이 오래 이어진 날" },
  { id: "q09", domain: "maintenance", text: "심한 코골이, 숨 멎음 목격, 숨 막힘으로 깬 경험", options: ["없다", "한 번 있었다", "2~3회 있었다", "반복되거나 자주 있다"], risk: "apnea", riskThreshold: 1 },
  { id: "q10", domain: "daytime", text: "최근 2주, 운전 중 졸거나 졸음 때문에 사고가 날 뻔한 경험", options: ["없다", "한 번 있었다", "2회 이상 있었다", "최근에도 있다"], risk: "driving", riskThreshold: 1 },
  { id: "q11", domain: "mind", text: "최근 2주, 마음의 안전과 관련해 가까운 도움을 받아야 한다고 느낀 적", hint: "이 문항은 점수보다 안전 안내에 우선 사용됩니다.", options: ["없다", "심한 우울감·무기력이 이어졌다", "자신을 해칠 생각이 든 적이 있다"], risk: "depression", riskThreshold: 1 },
];

export type Habit = {
  id: string;
  title: string;
  action: string;
  reason: string;
  domains: DomainId[];
  source: string;
};

export const habits: Habit[] = [
  { id: "morning-light", title: "아침 빛 10분", action: "기상 후 1시간 안에 창가나 야외에서 10분간 밝은 빛을 보세요.", reason: "아침 빛은 하루 생체 리듬의 기준점을 세우는 데 도움을 줍니다.", domains: ["rhythm", "recovery"], source: "책 기반 재구성: 아침부터 시작하는 수면 준비" },
  { id: "wake-anchor", title: "기상 시각 고정", action: "휴일에도 평일 기상 시각에서 2시간 이상 벗어나지 마세요.", reason: "주말의 큰 시차는 다음 날 밤의 졸림 시점을 늦출 수 있습니다.", domains: ["rhythm"], source: "책 기반 재구성: 생체 시계와 사회적 시차" },
  { id: "digital-off", title: "디지털 종료선", action: "취침 예정 60분 전 스마트폰을 침실 밖 충전 장소에 두세요.", reason: "빛뿐 아니라 정보 자극과 시간 지연을 함께 줄이는 행동입니다.", domains: ["onset", "mind"], source: "책 기반 재구성: 취침 전 각성 낮추기" },
  { id: "landing", title: "90분 착륙 루틴", action: "취침 90분 전 목욕이나 샤워를 마치고, 조명과 활동 강도를 낮추세요.", reason: "잠들기 직전이 아닌 저녁부터 단계적으로 쉬는 흐름을 만듭니다.", domains: ["onset", "body"], source: "책 기반 재구성: 하루의 수면 착륙 경로" },
  { id: "leave-bed", title: "졸릴 때 침대로", action: "20분가량 잠이 오지 않으면 잠시 침대를 나와 어두운 곳에서 조용한 활동을 하세요.", reason: "침대를 걱정하고 버티는 장소로 학습하는 것을 줄입니다.", domains: ["onset", "mind"], source: "책 기반 재구성: 잠이 오지 않을 때의 행동" },
  { id: "worry-note", title: "걱정 한 줄 분리", action: "잠들기 2시간 전 걱정과 내일 할 일을 각각 한 줄로 적고 덮어두세요.", reason: "해야 할 일을 기억하려는 긴장을 잠자리 밖으로 옮깁니다.", domains: ["mind", "onset"], source: "책 기반 재구성: 마음 정리" },
  { id: "nap", title: "낮잠 20분 제한", action: "낮잠은 오후 3시 이전, 20분 이내로 마치세요.", reason: "늦고 긴 낮잠이 밤의 수면 압력을 낮추는 것을 줄입니다.", domains: ["daytime", "onset"], source: "책 기반 재구성: 낮 시간 졸림 관리" },
  { id: "pain-reset", title: "통증 이완 5분", action: "취침 전 아프지 않은 범위에서 목·어깨 호흡 스트레칭을 5분 하세요.", reason: "누웠을 때의 긴장과 자세 바꾸기를 줄이는 작은 준비입니다.", domains: ["body", "maintenance"], source: "책 기반 재구성: 몸의 긴장과 수면 환경" },
  { id: "sleep-environment", title: "침실 방해 하나 제거", action: "오늘 밤 빛·소음·온도·침구 중 가장 큰 방해 요인 하나만 조정하세요.", reason: "환경을 한 번에 바꾸기보다 체감이 큰 항목부터 확인합니다.", domains: ["body", "maintenance"], source: "책 기반 재구성: 수면 환경 점검" },
];

export type Treatment = {
  id: string;
  name: string;
  studyType: string;
  summary: string;
  protocol?: string;
  caution: string;
  patterns: string[];
  sourceLabel: string;
  sourceUrl: string;
  secondarySourceLabel?: string;
  secondarySourceUrl?: string;
};

export const treatments: Treatment[] = [
  {
    id: "acupuncture",
    name: "침 치료",
    studyType: "무작위 대조시험",
    summary: "일차성·만성 불면 환자를 대상으로 한 임상시험에서 침 치료 후 ISI, PSQI와 과각성 지표의 개선이 보고됐습니다. 한 차례보다 일정 기간 경과를 함께 관찰하는 방식으로 연구됐습니다.",
    protocol: "연구 예시: 백회(GV20), 신정(GV24), 인당(EX-HN3), 신문(HT7), 삼음교(SP6), 안면혈 등이 사용됐습니다. 주 3회, 4주간 시행한 무작위시험이 있으며 일부 연구는 주 5회, 4주를 적용했습니다.",
    caution: "주 3회·4주는 연구에서 사용된 예시이지 모든 환자의 고정 치료 횟수가 아닙니다. 실제 계획은 불면 기간, 통증, 체력, 복용약과 반응을 확인해 정합니다.",
    patterns: ["과각성·입면형", "수면유지형", "갱년기 열감형"],
    sourceLabel: "Frontiers in Neurology, 2025 체계적 문헌고찰",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/40371085/",
  },
  {
    id: "electroacupuncture",
    name: "전침 치료",
    studyType: "무작위 대조시험",
    summary: "전침 임상시험에서는 수면의 질, 수면 효율과 불안·긴장 관련 지표의 변화를 관찰했습니다. 침에 일정한 저빈도 자극을 더하는 방식으로 연구됐습니다.",
    protocol: "연구 예시: 백회(GV20), 인당, 신문(HT7), 삼음교(SP6)에 2Hz 연속파를 적용해 주 3회, 4주간 총 12회 시행한 연구가 있습니다. 다른 연구에서는 약 30분 자극을 사용했습니다.",
    caution: "심박조율기 등 삽입형 전자장치, 임신, 감각 저하 등은 사전 확인이 필요합니다.",
    patterns: ["과각성·입면형", "통증 동반형"],
    sourceLabel: "Sleep, 2009 무작위 대조시험",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/19725255/",
  },
  {
    id: "cupping",
    name: "부항 치료",
    studyType: "4주 비교 연구",
    summary: "부항 연구에서는 수면 설문과 뇌 기능 연결성 변화를 함께 관찰했습니다. 진료에서는 불면 자체보다 목·어깨 긴장과 통증이 잠을 깨우는 경우의 보조 치료로 고려할 수 있습니다.",
    protocol: "연구 예시를 모든 환자의 고정 혈자리로 적용하지 않습니다. 풍지 주변을 포함한 경항부·상부 등은 해부학적 위치와 실제 긴장 부위를 진찰한 뒤 건식부항 등 적용 방식을 결정합니다.",
    caution: "피부 손상, 출혈 위험, 항응고제 복용 여부를 확인해야 합니다.",
    patterns: ["통증 동반형", "긴장성 두통 동반형"],
    sourceLabel: "NeuroImage: Clinical, 2019 대조 연구",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/30878612/",
  },
  {
    id: "pharmacopuncture",
    name: "약침·태반약침",
    studyType: "다기관 임상시험 프로토콜",
    summary: "불면 약침 임상시험에는 태반약침을 포함한 여러 제제가 사용 가능 치료로 포함됐고, 수면·감정·신체 증상을 함께 평가하도록 설계됐습니다. 태반약침이 포함된 스트레스 초점 약침 연구에서도 불안·긴장과 수면 지표를 관찰했습니다.",
    protocol: "연구 예시: 불면 환자 138명을 대상으로 4주간 10회 치료 후 4주 추적하는 연구가 설계됐습니다. 태반약침 연구 중에는 수면과 불안 지표를 부차적으로 평가한 연구가 있으나, 불면에서 태반약침 단독 우월성을 확정한 결과는 아닙니다.",
    caution: "태반약침의 제제·용량·혈위는 자동 추천하지 않습니다. 알레르기, 임신, 감염·출혈 위험과 복용약을 확인한 뒤 대면 진료에서 결정합니다.",
    patterns: ["복합 증상형", "갱년기 열감형"],
    sourceLabel: "IJERPH, 2022 불면 약침 다기관 임상시험 프로토콜",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9779640/",
    secondarySourceLabel: "Medicine, 2020 태반약침 임상시험 프로토콜",
    secondarySourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7668472/",
  },
  {
    id: "chuna",
    name: "추나 치료",
    studyType: "동반 통증 평가",
    summary: "불면 자체에 대한 직접 근거는 부족하며, 목·등의 움직임 제한과 통증이 수면을 끊는 경우 보조적으로 고려합니다.",
    caution: "경추 상태, 골다공증, 외상력 등을 대면 평가한 뒤 적용 여부를 정합니다.",
    patterns: ["통증 동반형", "자세 불편형"],
    sourceLabel: "근골격 동반 증상에 대한 보조적 임상 판단",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13156513/",
  },
  {
    id: "acupotomy",
    name: "도침 치료",
    studyType: "근골격 정밀 평가",
    summary: "단순 불면에 일률적으로 권하지 않습니다. 오래된 국소 유착성 통증이 잠을 반복해서 깨우는 일부 경우에만 정밀 평가 후 검토합니다.",
    caution: "일반 침보다 조직 자극이 크므로 해부학적 평가와 감염·출혈 위험 확인이 필수입니다.",
    patterns: ["만성 국소 통증형"],
    sourceLabel: "불면 직접 치료 근거 부족",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13156513/",
  },
  {
    id: "herbal",
    name: "한약 치료",
    studyType: "임상시험·문헌고찰",
    summary: "여러 임상시험을 모은 연구에서 수면지표 개선 가능성이 보고됐지만 처방별 연구 품질과 편향 차이가 큽니다.",
    protocol: "자동으로 처방명을 제시하지 않습니다. 열감, 피로, 불안, 야간뇨, 소화 상태와 복용약을 함께 확인합니다.",
    caution: "간·신장 기능, 임신, 기존 약물과의 상호작용을 확인한 뒤 개별 처방해야 합니다.",
    patterns: ["갱년기 열감형", "피로 동반형", "수면유지형"],
    sourceLabel: "Frontiers in Pharmacology, 2024 갱년기 불면 메타분석",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/39175534/",
  },
];

export const riskCopy: Record<RiskId, { title: string; body: string; urgent?: boolean }> = {
  apnea: { title: "수면호흡 평가를 먼저 고려하세요", body: "심한 코골이, 목격된 무호흡, 숨 막힘은 설문만으로 판단할 수 없습니다. 수면검사와 의과 평가를 우선 고려하세요." },
  driving: { title: "졸음운전을 중단하세요", body: "평가와 치료로 졸림이 조절되기 전까지 운전이나 위험한 기계 조작을 피하고 신속히 의료진과 상의하세요.", urgent: true },
  depression: { title: "정신건강 평가를 함께 권합니다", body: "심한 우울감이 이어진다면 수면 습관 관리만으로 미루지 말고 정신건강의학과 또는 가까운 의료기관과 상의하세요." },
  selfHarm: { title: "지금 안전을 먼저 확보하세요", body: "혼자 있지 말고 가까운 사람에게 즉시 알리세요. 당장 해칠 가능성이 있으면 119·112 또는 가까운 응급실에 연락하세요.", urgent: true },
};
