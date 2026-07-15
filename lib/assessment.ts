import { domains, habits, questions, type DomainId, type Habit, type RiskId } from "@/data/content";

export type Answers = Record<string, number>;

export type AssessmentResult = {
  total: number;
  domainScores: Record<DomainId, number>;
  pattern: string;
  patternSummary: string;
  risks: RiskId[];
  habits: Habit[];
};

const patternCopy: Record<string, string> = {
  "생활리듬 불균형형": "평일과 휴일의 시간 차이, 아침 빛과 기상 기준점이 현재 수면에 큰 영향을 주는 패턴입니다.",
  "잠들기 전 과각성형": "잠들기 전까지 생각과 자극이 이어져 몸과 마음의 각성 수준이 충분히 낮아지지 않는 패턴입니다.",
  "수면유지 취약형": "밤중 각성이나 조기 각성이 두드러집니다. 야간뇨·통증·호흡 신호를 함께 구분해야 합니다.",
  "아침 회복 저하형": "잠을 잔 뒤에도 개운함이 낮고 수면 관성이 오래 이어지는 패턴입니다.",
  "낮 시간 졸림형": "낮의 졸림이 두드러집니다. 실제 수면량과 호흡 문제, 복용약을 함께 확인할 필요가 있습니다.",
  "통증·환경 동반형": "누웠을 때의 통증이나 침실 환경이 수면을 반복해서 방해하는 패턴입니다.",
  "걱정·긴장 동반형": "걱정과 수면 불안이 잠자리에서 반복되는 패턴입니다.",
};

export function calculateAssessment(answers: Answers): AssessmentResult {
  const domainScores = Object.keys(domains).reduce((acc, domain) => {
    const items = questions.filter((question) => question.domain === domain);
    const risk = items.reduce((sum, item) => sum + (answers[item.id] ?? 0), 0);
    acc[domain as DomainId] = Math.round(100 - (risk / (items.length * 3)) * 100);
    return acc;
  }, {} as Record<DomainId, number>);

  const total = Math.round(
    Object.values(domainScores).reduce((sum, score) => sum + score, 0) /
      Object.values(domainScores).length,
  );

  const worstDomain = (Object.entries(domainScores) as [DomainId, number][]).sort(
    (a, b) => a[1] - b[1],
  )[0][0];

  const patternByDomain: Record<DomainId, string> = {
    rhythm: "생활리듬 불균형형",
    onset: "잠들기 전 과각성형",
    maintenance: "수면유지 취약형",
    recovery: "아침 회복 저하형",
    daytime: "낮 시간 졸림형",
    body: "통증·환경 동반형",
    mind: "걱정·긴장 동반형",
  };
  const pattern = patternByDomain[worstDomain];

  const risks = questions
    .filter(
      (question) =>
        question.risk &&
        (answers[question.id] ?? 0) >= (question.riskThreshold ?? 1),
    )
    .map((question) => question.risk as RiskId)
    .filter((risk, index, all) => all.indexOf(risk) === index);

  if ((answers.q11 ?? 0) >= 2 && !risks.includes("selfHarm")) {
    risks.push("selfHarm");
  }

  const rankedHabits = habits
    .map((habit) => ({
      habit,
      score: habit.domains.reduce((sum, domain) => sum + (100 - domainScores[domain]), 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ habit }) => habit);

  const selected: Habit[] = [];
  for (const habit of rankedHabits) {
    if (selected.length === 3) break;
    if (selected.every((item) => item.domains[0] !== habit.domains[0]) || selected.length === 2) {
      selected.push(habit);
    }
  }

  return {
    total,
    domainScores,
    pattern,
    patternSummary: patternCopy[pattern],
    risks,
    habits: selected,
  };
}

export const emptyAnswers = questions.reduce((acc, question) => {
  acc[question.id] = -1;
  return acc;
}, {} as Answers);
