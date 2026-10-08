import type { ClinicalCase, ClinicalCheckpoint, SleepRiskId } from "./schema";

type ChangeLine = {
  label: string;
  current?: number;
  previous?: number;
  unit?: string;
  lowerIsBetter?: boolean;
};

function formatChange(line: ChangeLine): string | null {
  if (line.current === undefined || line.previous === undefined) return null;
  const delta = line.current - line.previous;
  if (delta === 0) return `${line.label}: 변화 없음 (${line.current}${line.unit ?? ""})`;

  const improved = line.lowerIsBetter ? delta < 0 : delta > 0;
  const arrow = improved ? "개선" : "악화";
  return `${line.label}: ${line.previous} → ${line.current}${line.unit ?? ""} (${arrow})`;
}

function latestTwo(checkpoints: ClinicalCheckpoint[]) {
  const sorted = [...checkpoints].sort((a, b) => a.date.localeCompare(b.date));
  return {
    previous: sorted.at(-2),
    current: sorted.at(-1),
  };
}

function riskLabel(risk: SleepRiskId): string {
  switch (risk) {
    case "apnea":
      return "수면호흡 관련 주의 신호";
    case "driving":
      return "졸음운전 관련 주의 신호";
    case "depression":
      return "정신건강 관련 주의 신호";
    case "selfHarm":
      return "즉시 확인이 필요한 안전 관련 신호";
  }
}

export type DoctorBrief = {
  header: string;
  changes: string[];
  questions: string[];
  cautions: string[];
  sourceNote: string;
};

export function buildDoctorBrief(clinicalCase: ClinicalCase): DoctorBrief {
  const { previous, current } = latestTwo(clinicalCase.checkpoints);
  if (!current) {
    return {
      header: `${clinicalCase.caseId} / ${clinicalCase.ageBand}`,
      changes: [],
      questions: ["경과 데이터가 없습니다. 초기 평가를 완료하세요."],
      cautions: [],
      sourceNote: "자동 진단·자동 처방이 아닌 진료 전 요약입니다.",
    };
  }

  const changes = previous
    ? [
        formatChange({
          label: "수면 습관 총점",
          previous: previous.sleepHabitAssessment?.total,
          current: current.sleepHabitAssessment?.total,
          unit: "/100",
        }),
        formatChange({
          label: "중간각성",
          previous: previous.sleep?.awakenings,
          current: current.sleep?.awakenings,
          unit: "회",
          lowerIsBetter: true,
        }),
        formatChange({
          label: "야간뇨",
          previous: previous.sleep?.nocturiaCount,
          current: current.sleep?.nocturiaCount,
          unit: "회",
          lowerIsBetter: true,
        }),
        formatChange({
          label: "아침 회복감",
          previous: previous.sleep?.morningRecovery0to10,
          current: current.sleep?.morningRecovery0to10,
          unit: "/10",
        }),
        formatChange({
          label: "통증",
          previous: previous.aging?.pain0to10,
          current: current.aging?.pain0to10,
          unit: "/10",
          lowerIsBetter: true,
        }),
        formatChange({
          label: "피로",
          previous: previous.aging?.fatigue0to10,
          current: current.aging?.fatigue0to10,
          unit: "/10",
          lowerIsBetter: true,
        }),
      ].filter((line): line is string => Boolean(line))
    : ["초기 평가: 비교 가능한 이전 방문 데이터가 없습니다."];

  const questions: string[] = [];
  const cautions: string[] = [];

  if ((current.sleep?.nocturiaCount ?? 0) >= 2) {
    questions.push("야간뇨 증가 시점, 수분섭취, 복용약 변화 확인");
  }
  if (current.sleep?.snoringOrWitnessedApnea) {
    questions.push("코골이·목격 무호흡·기상 시 두통·주간 졸림 확인");
    cautions.push("수면호흡장애 가능성은 별도 의학적 평가가 필요할 수 있음");
  }
  if ((current.sleep?.daytimeSleepiness0to10 ?? 0) >= 7) {
    questions.push("운전 중 졸림 또는 사고 위험 여부 확인");
    cautions.push("심한 주간졸림이 있으면 안전 관련 안내 우선");
  }
  if ((current.aging?.fallsPast12Months ?? 0) > 0) {
    questions.push("최근 낙상 상황, 어지럼, 보행 보조도구, 복용약 확인");
  }
  if ((current.aging?.medicationCount ?? 0) >= 5) {
    questions.push("최근 추가·중단된 약과 복용시간 확인");
  }

  for (const risk of current.sleepHabitAssessment?.risks ?? []) {
    const label = riskLabel(risk);
    if (!cautions.includes(label)) cautions.push(label);
  }

  if (questions.length === 0) {
    questions.push("지난 방문 이후 가장 불편했던 변화 1가지를 확인");
  }

  return {
    header: `${clinicalCase.caseId} / ${clinicalCase.ageBand}`,
    changes,
    questions,
    cautions,
    sourceNote:
      "구조화된 경과 기록을 요약한 진료 보조 정보입니다. 자동 진단·자동 처방을 하지 않습니다.",
  };
}
