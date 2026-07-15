"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  ExternalLink,
  HeartPulse,
  MoonStar,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  SunMedium,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import {
  answerLabels,
  clinic,
  domains,
  questions,
  riskCopy,
  treatments,
  type DomainId,
} from "@/data/content";
import {
  calculateAssessment,
  emptyAnswers,
  type Answers,
  type AssessmentResult,
} from "@/lib/assessment";

type Screen = "landing" | "assessment" | "results" | "plan" | "report";
type DailyLog = {
  habits: string[];
  refresh: number;
  latency: number;
  awakenings: number;
  lateMeal: boolean;
  drinks: number;
  reason: "" | "hunger" | "habit" | "meeting" | "stress" | "work" | "other";
};
type WeekLogs = Record<number, DailyLog>;

const STORAGE_KEY = "sleep-habit-mvp-v1";

const defaultLogs = Array.from({ length: 7 }, (_, index) => index + 1).reduce(
  (acc, day) => {
    acc[day] = { habits: [], refresh: 0, latency: 0, awakenings: 0, lateMeal: false, drinks: 0, reason: "" };
    return acc;
  },
  {} as WeekLogs,
);

function scoreLabel(score: number) {
  if (score >= 80) return "숙면 기반이 안정적입니다";
  if (score >= 65) return "일부 습관 조정이 필요합니다";
  if (score >= 45) return "수면의 질을 방해하는 습관이 보입니다";
  return "적극적인 개선과 전문 평가를 고려하세요";
}

function hasDailyRecord(log: DailyLog) {
  return log.habits.length > 0 || log.refresh > 0 || log.latency > 0 || log.awakenings > 0 || log.lateMeal || log.drinks > 0 || log.reason !== "";
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [baselineScore, setBaselineScore] = useState<number | null>(null);
  const [weekLogs, setWeekLogs] = useState<WeekLogs>(defaultLogs);
  const [activeDay, setActiveDay] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const state = JSON.parse(saved) as {
            answers?: Answers;
            result?: AssessmentResult;
            baselineScore?: number;
            weekLogs?: WeekLogs;
          };
          if (state.answers) setAnswers(state.answers);
          if (state.result) setResult(state.result);
          if (typeof state.baselineScore === "number") setBaselineScore(state.baselineScore);
          if (state.weekLogs) setWeekLogs(state.weekLogs);
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ answers, result, baselineScore, weekLogs }),
    );
  }, [answers, result, baselineScore, weekLogs, hydrated]);

  const completion = Math.round(
    (Object.values(weekLogs).filter((log) => hasDailyRecord(log)).length / 7) * 100,
  );

  const treatmentMatches = useMemo(() => {
    if (!result) return treatments.slice(0, 3);
    const keys = result.pattern.includes("통증")
      ? ["acupuncture", "electroacupuncture", "cupping", "chuna", "acupotomy"]
      : result.pattern.includes("과각성") || result.pattern.includes("걱정")
        ? ["acupuncture", "electroacupuncture", "herbal"]
        : result.pattern.includes("유지")
          ? ["acupuncture", "herbal", "cupping"]
          : ["acupuncture", "herbal", "pharmacopuncture"];
    return keys.map((id) => treatments.find((item) => item.id === id)).filter(Boolean).slice(0, 4);
  }, [result]);

  function startAssessment(isRetest = false) {
    if (isRetest && result) setBaselineScore(result.total);
    setAnswers({ ...emptyAnswers });
    setQuestionIndex(0);
    setScreen("assessment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseAnswer(value: number) {
    const question = questions[questionIndex];
    setAnswers((current) => ({ ...current, [question.id]: value }));
  }

  function nextQuestion() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      return;
    }
    const assessment = calculateAssessment(answers);
    if (baselineScore === null) setBaselineScore(assessment.total);
    setResult(assessment);
    setScreen("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigate(next: Screen) {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleHabit(day: number, habitId: string) {
    setWeekLogs((current) => {
      const selected = current[day].habits;
      const habits = selected.includes(habitId)
        ? selected.filter((id) => id !== habitId)
        : [...selected, habitId];
      return { ...current, [day]: { ...current[day], habits } };
    });
  }

  function updateLog(field: Exclude<keyof DailyLog, "habits">, value: DailyLog[Exclude<keyof DailyLog, "habits">]) {
    setWeekLogs((current) => ({
      ...current,
      [activeDay]: { ...current[activeDay], [field]: value },
    }));
  }

  function resetAll() {
    window.localStorage.removeItem(STORAGE_KEY);
    setAnswers({ ...emptyAnswers });
    setResult(null);
    setBaselineScore(null);
    setWeekLogs(defaultLogs);
    setScreen("landing");
  }

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <button className={styles.brandButton} onClick={() => navigate("landing")} aria-label="처음 화면">
          <span className={styles.brandMark}><MoonStar size={18} /></span>
          <span><strong>숙면습관 진단실</strong><small>{clinic.name}</small></span>
        </button>
        {result && screen !== "assessment" && (
          <nav className={styles.headerNav} aria-label="주요 화면">
            <button className={screen === "results" ? styles.activeNav : ""} onClick={() => navigate("results")}>결과</button>
            <button className={screen === "plan" ? styles.activeNav : ""} onClick={() => navigate("plan")}>수면일지</button>
            <button className={screen === "report" ? styles.activeNav : ""} onClick={() => navigate("report")}>리포트</button>
          </nav>
        )}
      </header>

      {screen === "landing" && <Landing onStart={() => startAssessment()} hasResult={Boolean(result)} onResume={() => navigate("results")} />}

      {screen === "assessment" && (
        <Assessment
          index={questionIndex}
          answers={answers}
          onAnswer={chooseAnswer}
          onBack={() => questionIndex > 0 ? setQuestionIndex((index) => index - 1) : navigate(result ? "results" : "landing")}
          onNext={nextQuestion}
        />
      )}

      {screen === "results" && result && (
        <Results
          result={result}
          baselineScore={baselineScore}
          treatments={treatmentMatches as typeof treatments}
          onPlan={() => navigate("plan")}
          onRetest={() => startAssessment(true)}
        />
      )}

      {screen === "plan" && result && (
        <Plan
          result={result}
          logs={weekLogs}
          activeDay={activeDay}
          completion={completion}
          onDay={setActiveDay}
          onToggle={toggleHabit}
          onMetric={updateLog}
          onReport={() => navigate("report")}
        />
      )}

      {screen === "report" && result && (
        <Report
          result={result}
          baselineScore={baselineScore}
          logs={weekLogs}
          completion={completion}
          onRetest={() => startAssessment(true)}
        />
      )}

      <footer className={styles.footer}>
        <div>
          <strong>{clinic.name} · {clinic.doctor}</strong>
          <p>{clinic.notice}</p>
        </div>
        <button className={styles.textButton} onClick={resetAll}><RefreshCcw size={15} /> 내 기록 초기화</button>
      </footer>
    </main>
  );
}

function Landing({ onStart, hasResult, onResume }: { onStart: () => void; hasResult: boolean; onResume: () => void }) {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><BookOpen size={16} /> 『숙면하는 습관』 실천 프로그램</div>
          <h1>나는 왜 자도 자도<br />피곤할까요?</h1>
          <p>1분 동안 최근 2주의 수면 흐름을 점검하고, 매일 30초 수면일지로 내 습관과 이유를 함께 살펴보세요.</p>
          <div className={styles.heroActions}>
            <button className={styles.primaryButton} onClick={hasResult ? onResume : onStart}>
              {hasResult ? "내 결과 이어보기" : "1분 진단 시작"}<ArrowRight size={18} />
            </button>
            {hasResult && <button className={styles.secondaryButton} onClick={onStart}>새로 진단</button>}
          </div>
          <div className={styles.trustRow}>
            <span><ShieldCheck size={16} /> 회원가입 없음</span>
            <span><ClipboardCheck size={16} /> 11문항 · 약 1분</span>
            <span><HeartPulse size={16} /> 위험 신호 별도 확인</span>
          </div>
        </div>
        <div className={styles.heroPanel} aria-label="프로그램 구성 미리보기">
          <div className={styles.doctorLine}>
            <span className={styles.doctorInitial}>김</span>
            <div><small>{clinic.name}</small><strong>{clinic.doctor}</strong><span>{clinic.credential}</span></div>
          </div>
          <div className={styles.bookCredits}>
            <span>대표 역서</span>
            {clinic.books.map((book) => <strong key={book}>{book}</strong>)}
          </div>
          <div className={styles.routeList}>
            <div><span>01</span><p><strong>수면 패턴</strong>입면·유지·회복·리듬 분석</p><CheckCircle2 size={19} /></div>
            <div><span>02</span><p><strong>매일 수면일지</strong>야식·음주·이유를 30초 기록</p><CheckCircle2 size={19} /></div>
            <div><span>03</span><p><strong>진료 안내</strong>논문 속 치료 예시와 안전 분기</p><CheckCircle2 size={19} /></div>
          </div>
          <div className={styles.safetyNote}><AlertTriangle size={18} /><p><strong>자동 진단·자동 처방을 하지 않습니다.</strong> 결과는 의료진과 상의할 내용을 정리하는 데 사용됩니다.</p></div>
        </div>
      </section>

      <section className={styles.processBand}>
        <div className={styles.sectionHeading}>
          <span>숙면을 한 장면이 아닌 하루의 흐름으로 봅니다</span>
          <h2>아침부터 밤까지, 수면을 방해하는 지점을 찾습니다</h2>
        </div>
        <div className={styles.timeline}>
          <div><SunMedium size={21} /><strong>아침 빛</strong><span>생체 시계의 기준점</span></div>
          <div><Sparkles size={21} /><strong>낮 활동</strong><span>졸림과 수면 압력</span></div>
          <div><MoonStar size={21} /><strong>저녁 착륙</strong><span>자극과 긴장 낮추기</span></div>
          <div><BarChart3 size={21} /><strong>7일 변화</strong><span>실천과 회복 비교</span></div>
        </div>
      </section>
    </>
  );
}

function Assessment({ index, answers, onAnswer, onBack, onNext }: { index: number; answers: Answers; onAnswer: (value: number) => void; onBack: () => void; onNext: () => void }) {
  const question = questions[index];
  const selected = answers[question.id];
  const progress = ((index + 1) / questions.length) * 100;
  return (
    <section className={styles.assessmentShell}>
      <div className={styles.assessmentTop}>
        <button className={styles.iconButton} onClick={onBack} title="이전"><ArrowLeft size={20} /></button>
        <div className={styles.progressMeta}><span>{index + 1} / {questions.length}</span><strong>{domains[question.domain].label}</strong></div>
        <span className={styles.timeLeft}>약 {Math.max(1, Math.ceil((questions.length - index) / 8))}분</span>
      </div>
      <div className={styles.progressTrack}><span style={{ width: `${progress}%` }} /></div>
      <div className={styles.questionArea}>
        <span className={styles.questionNumber}>Q{String(index + 1).padStart(2, "0")}</span>
        <h2>{question.text}</h2>
        {question.hint && <p className={styles.questionHint}><ShieldCheck size={17} />{question.hint}</p>}
        <div className={styles.answerGrid} role="radiogroup" aria-label="응답 선택">
          {(question.options ?? answerLabels).map((label, value) => (
            <button
              key={label}
              className={selected === value ? styles.answerSelected : styles.answerButton}
              onClick={() => onAnswer(value)}
              role="radio"
              aria-checked={selected === value}
            >
              <span>{value}</span><strong>{label}</strong>{selected === value && <Check size={19} />}
            </button>
          ))}
        </div>
        <button className={styles.primaryButton} disabled={selected < 0} onClick={onNext}>
          {index === questions.length - 1 ? "결과 확인" : "다음 문항"}<ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function Results({ result, baselineScore, treatments: matchedTreatments, onPlan, onRetest }: { result: AssessmentResult; baselineScore: number | null; treatments: typeof treatments; onPlan: () => void; onRetest: () => void }) {
  const delta = baselineScore !== null ? result.total - baselineScore : 0;
  return (
    <div className={styles.contentPage}>
      <section className={styles.resultHero}>
        <div>
          <div className={styles.eyebrow}><Stethoscope size={16} /> 김성혁 원장의 숙면습관 분석</div>
          <h1>{result.pattern}</h1>
          <p>{result.patternSummary}</p>
        </div>
        <div className={styles.scoreGauge} style={{ "--score": `${result.total * 3.6}deg` } as React.CSSProperties}>
          <div><strong>{result.total}</strong><span>/ 100점</span></div>
        </div>
      </section>

      {delta !== 0 && <div className={styles.deltaBanner}><BarChart3 size={19} /> 이전 진단보다 <strong>{Math.abs(delta)}점 {delta > 0 ? "높아졌습니다" : "낮아졌습니다"}</strong></div>}

      {result.risks.length > 0 && (
        <section className={styles.riskSection}>
          <div className={styles.sectionHeading}><span>점수보다 먼저 확인합니다</span><h2>전문 평가가 우선인 신호</h2></div>
          <div className={styles.riskList}>
            {result.risks.map((risk) => (
              <article key={risk} className={riskCopy[risk].urgent ? styles.riskUrgent : styles.riskCard}>
                <AlertTriangle size={22} /><div><strong>{riskCopy[risk].title}</strong><p>{riskCopy[risk].body}</p></div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className={styles.dashboardSection}>
        <div className={styles.sectionHeading}><span>{scoreLabel(result.total)}</span><h2>영역별 숙면 기반</h2></div>
        <div className={styles.scoreBars}>
          {(Object.entries(result.domainScores) as [DomainId, number][]).map(([domain, score]) => (
            <div key={domain} className={styles.scoreRow}>
              <span>{domains[domain].label}</span>
              <div><i style={{ width: `${score}%` }} /></div>
              <strong>{score}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.habitSection}>
        <div className={styles.sectionHeading}><span>많이 말하기보다, 먼저 할 세 가지</span><h2>오늘부터 시작할 맞춤 습관</h2></div>
        <div className={styles.habitGrid}>
          {result.habits.map((habit, index) => (
            <article className={styles.habitCard} key={habit.id}>
              <span className={styles.cardIndex}>0{index + 1}</span><h3>{habit.title}</h3><p>{habit.action}</p><small>{habit.reason}</small><div><BookOpen size={14} />{habit.source}</div>
            </article>
          ))}
        </div>
        <button className={styles.primaryButton} onClick={onPlan}>오늘의 수면일지 시작<CalendarCheck size={18} /></button>
      </section>

      <section className={styles.treatmentSection}>
        <div className={styles.sectionHeading}><span>자가진단 결과는 치료 지시가 아닙니다</span><h2>논문을 바탕으로 진료에서 고려할 치료</h2><p>불면 연구에서 사용된 혈자리·자극 방식·치료 기간을 보여드립니다. 실제 치료는 김성혁 원장이 수면 패턴과 동반 증상을 진찰한 뒤 필요한 항목만 선택합니다.</p></div>
        <div className={styles.researchRhythm}><CalendarCheck size={22} /><div><span>불면 침 임상시험의 경과 관찰 예시</span><strong>주 3회 · 4주간 치료 후 변화 평가</strong><p>ISI·PSQI와 과각성 지표의 변화를 관찰한 연구 설계입니다. 개인별 치료 횟수와 기간은 초진 및 치료 반응에 따라 달라집니다.</p></div></div>
        <div className={styles.treatmentGrid}>
          {matchedTreatments.map((treatment) => <TreatmentCard key={treatment.id} treatment={treatment} />)}
        </div>
        <details className={styles.allEvidence}>
          <summary>전체 치료 연구와 적용 범위 보기 <ChevronDown size={18} /></summary>
          <div className={styles.evidenceTable}>
            {treatments.map((item) => <div key={item.id}><strong>{item.name}</strong><span className={styles.studyType}>{item.studyType}</span><p>{item.summary}</p></div>)}
          </div>
        </details>
      </section>

      <Consultation pattern={result.pattern} />
      <div className={styles.centerAction}><button className={styles.textButton} onClick={onRetest}><RefreshCcw size={16} /> 재진단 시작</button></div>
    </div>
  );
}

function TreatmentCard({ treatment }: { treatment: (typeof treatments)[number] }) {
  return (
    <article className={styles.treatmentCard}>
      <div className={styles.treatmentTop}><h3>{treatment.name}</h3><span className={styles.studyType}>{treatment.studyType}</span></div>
      <p>{treatment.summary}</p>
      {treatment.protocol && <div className={styles.protocol}><CircleHelp size={17} /><span>{treatment.protocol}</span></div>}
      <small><ShieldCheck size={15} />{treatment.caution}</small>
      <a href={treatment.sourceUrl} target="_blank" rel="noreferrer">{treatment.sourceLabel}<ExternalLink size={14} /></a>
      {treatment.secondarySourceUrl && <a href={treatment.secondarySourceUrl} target="_blank" rel="noreferrer">{treatment.secondarySourceLabel}<ExternalLink size={14} /></a>}
    </article>
  );
}

function Plan({ result, logs, activeDay, completion, onDay, onToggle, onMetric, onReport }: { result: AssessmentResult; logs: WeekLogs; activeDay: number; completion: number; onDay: (day: number) => void; onToggle: (day: number, id: string) => void; onMetric: (field: Exclude<keyof DailyLog, "habits">, value: DailyLog[Exclude<keyof DailyLog, "habits">]) => void; onReport: () => void }) {
  const log = logs[activeDay];
  const needsReason = log.lateMeal || log.drinks > 0;
  return (
    <div className={styles.contentPage}>
      <section className={styles.planHeader}>
        <div><div className={styles.eyebrow}><CalendarCheck size={16} /> 7일 수면일지</div><h1>클릭 몇 번으로<br />내 수면의 맥락을 남깁니다</h1></div>
        <div className={styles.completion}><strong>{completion}%</strong><span>기록 진행률</span></div>
      </section>
      <div className={styles.dayTabs} role="tablist">
        {Object.keys(logs).map((dayString) => {
          const day = Number(dayString);
          return <button key={day} role="tab" aria-selected={activeDay === day} className={activeDay === day ? styles.activeDay : ""} onClick={() => onDay(day)}><span>{day}</span><small>DAY</small>{hasDailyRecord(logs[day]) && <Check size={13} />}</button>;
        })}
      </div>
      <section className={styles.checkSection}>
        <div className={styles.sectionHeading}><span>DAY {activeDay}</span><h2>오늘의 실천</h2><p>추천 습관을 실천했다면 가볍게 눌러 남겨 주세요.</p></div>
        <div className={styles.checkList}>
          {result.habits.map((habit) => {
            const checked = log.habits.includes(habit.id);
            return <button key={habit.id} className={checked ? styles.checkedHabit : styles.checkHabit} onClick={() => onToggle(activeDay, habit.id)}><span>{checked ? <Check size={19} /> : null}</span><div><strong>{habit.title}</strong><p>{habit.action}</p></div></button>;
          })}
        </div>
      </section>
      <section className={styles.metricsSection}>
        <div className={styles.sectionHeading}><span>아침 30초 기록</span><h2>숫자 입력 없이, 기억나는 만큼만</h2></div>
        <LogChoices label="아침에 얼마나 개운했나요?" value={log.refresh} options={[[1, "많이 피곤"], [2, "피곤"], [3, "보통"], [4, "괜찮음"], [5, "개운함"]]} onChange={(value) => onMetric("refresh", value)} />
        <LogChoices label="잠들기까지 얼마나 걸렸나요?" value={log.latency} options={[[10, "20분 이내"], [30, "20~40분"], [60, "40분 이상"]]} onChange={(value) => onMetric("latency", value)} />
        <LogChoices label="밤중에 몇 번 깼나요?" value={log.awakenings} options={[[0, "안 깸"], [1, "1번"], [2, "2번 이상"]]} onChange={(value) => onMetric("awakenings", value)} />
      </section>
      <section className={styles.contextSection}>
        <div className={styles.sectionHeading}><span>저녁 맥락 기록</span><h2>야식과 음주, 이유까지 함께 봅니다</h2><p>이유를 남기면 다음 주에 ‘왜 반복됐는지’를 생활 맥락 안에서 확인할 수 있습니다.</p></div>
        <LogChoices label="야식을 먹었나요?" value={log.lateMeal ? 1 : 0} options={[[0, "아니요"], [1, "먹었어요"]]} onChange={(value) => onMetric("lateMeal", value === 1)} />
        <LogChoices label="술은 몇 잔 마셨나요?" value={log.drinks} options={[[0, "안 마심"], [1, "1~2잔"], [2, "3~4잔"], [3, "5잔 이상"]]} onChange={(value) => onMetric("drinks", value)} />
        {needsReason && <LogChoices label="오늘 이런 선택을 한 이유에 가까운 것은?" value={reasonOptions.findIndex(([value]) => value === log.reason)} options={reasonOptions.map(([, label], index) => [index, label] as [number, string])} onChange={(index) => onMetric("reason", reasonOptions[index][0])} />}
      </section>
      <div className={styles.planActions}><button className={styles.primaryButton} onClick={onReport}>변화 리포트 보기<BarChart3 size={18} /></button></div>
    </div>
  );
}

const reasonOptions: [DailyLog["reason"], string][] = [
  ["hunger", "배고파서"],
  ["habit", "습관적으로"],
  ["meeting", "회식·모임 때문에"],
  ["stress", "스트레스를 풀려고"],
  ["work", "늦은 업무·일정 때문에"],
  ["other", "그 밖의 이유"],
];

function LogChoices({ label, value, options, onChange }: { label: string; value: number; options: [number, string][]; onChange: (value: number) => void }) {
  return <div className={styles.logChoiceGroup}><span>{label}</span><div>{options.map(([optionValue, optionLabel]) => <button key={optionLabel} className={value === optionValue ? styles.logChoiceSelected : styles.logChoice} onClick={() => onChange(optionValue)}>{optionLabel}</button>)}</div></div>;
}

function getContextSummary(logs: WeekLogs) {
  const recorded = Object.values(logs);
  const lateMealDays = recorded.filter((log) => log.lateMeal).length;
  const alcoholDays = recorded.filter((log) => log.drinks > 0).length;
  const reasons = recorded.map((log) => log.reason).filter((reason): reason is Exclude<DailyLog["reason"], ""> => reason !== "");
  const mostFrequentReason = reasons.sort((a, b) => reasons.filter((item) => item === b).length - reasons.filter((item) => item === a).length)[0];
  const reasonLabel = reasonOptions.find(([value]) => value === mostFrequentReason)?.[1];
  return [lateMealDays > 0 ? `야식 ${lateMealDays}일` : "", alcoholDays > 0 ? `음주 ${alcoholDays}일` : "", reasonLabel ? `가장 자주 고른 이유: ${reasonLabel}` : ""].filter(Boolean).join(" · ");
}

function Report({ result, baselineScore, logs, completion, onRetest }: { result: AssessmentResult; baselineScore: number | null; logs: WeekLogs; completion: number; onRetest: () => void }) {
  const entered = Object.values(logs).filter(hasDailyRecord);
  const average = (field: "refresh" | "latency" | "awakenings") => entered.length ? Math.round((entered.reduce((sum, log) => sum + log[field], 0) / entered.length) * 10) / 10 : 0;
  const habitChecks = Object.values(logs).reduce((sum, log) => sum + log.habits.length, 0);
  const alcoholDays = Object.values(logs).filter((log) => log.drinks > 0).length;
  const contextSummary = getContextSummary(logs);
  const delta = baselineScore === null ? 0 : result.total - baselineScore;
  return (
    <div className={styles.contentPage}>
      <section className={styles.reportHero}>
        <div className={styles.eyebrow}><BarChart3 size={16} /> 나의 변화 리포트</div>
        <h1>{entered.length > 0 ? `${entered.length}일의 기록이 쌓였습니다` : "첫 기록부터 변화가 시작됩니다"}</h1>
        <p>정확한 진단 수치가 아니라, 내 습관과 아침 느낌이 함께 움직이는지 살펴보는 기록입니다.</p>
      </section>
      <section className={styles.reportStats}>
        <article><span>실천 진행률</span><strong>{completion}<small>%</small></strong><p>기록한 날 기준</p></article>
        <article><span>습관 완료</span><strong>{habitChecks}<small>회</small></strong><p>세 가지 습관 합계</p></article>
        <article><span>아침 개운함</span><strong>{average("refresh")}<small>/5</small></strong><p>입력일 평균</p></article>
        <article><span>음주 기록</span><strong>{alcoholDays}<small>일</small></strong><p>7일 중 선택한 날</p></article>
      </section>
      <section className={styles.weekChart}>
        <div className={styles.sectionHeading}><span>7일 흐름</span><h2>아침 개운함 기록</h2></div>
        <div className={styles.barChart}>
          {Object.entries(logs).map(([day, log]) => <div key={day}><span style={{ height: `${Math.max(4, (log.refresh / 5) * 100)}%` }} /><strong>{log.refresh || "-"}</strong><small>D{day}</small></div>)}
        </div>
      </section>
      {contextSummary && <section className={styles.contextInsight}><span>생활 맥락 한눈에 보기</span><strong>{contextSummary}</strong><p>이 기록은 원인을 단정하지 않고, 다음 상담이나 실천 계획에서 함께 확인할 단서를 남깁니다.</p></section>}
      <section className={styles.retestSection}>
        <div><span>7일 후 같은 문항으로 다시 확인하세요</span><h2>현재 습관 점수 {result.total}점{delta !== 0 ? ` · 이전 대비 ${delta > 0 ? "+" : ""}${delta}점` : ""}</h2><p>점수 변화와 별개로 무호흡, 졸음운전, 심한 우울 신호가 있으면 전문 평가가 우선입니다.</p></div>
        <button className={styles.primaryButton} onClick={onRetest}><RefreshCcw size={18} /> 재진단 시작</button>
      </section>
      <Consultation pattern={result.pattern} />
    </div>
  );
}

function Consultation({ pattern }: { pattern: string }) {
  return (
    <section id="consultation" className={styles.consultation}>
      <div>
        <span>{clinic.name}</span>
        <h2>생활 습관과 한의원 치료를<br />함께 계획합니다</h2>
        <p>진단 결과와 7일 기록을 함께 보여주면 {pattern}에 영향을 주는 긴장·통증·열감·야간 각성을 확인하고, 침·전침·부항·약침·한약 중 필요한 치료와 내원 간격을 상담할 수 있습니다. 일부 불면 침 연구는 주 3회, 4주간 경과를 관찰했습니다.</p>
        <div className={styles.consultSteps}><span>초진: 위험 신호·복용약·통증 확인</span><span>치료 중: 수면일지와 반응 확인</span><span>재평가: 수면 지표와 아침 회복 비교</span></div>
      </div>
      <div className={styles.consultActions}>
        <a className={styles.primaryButton} href={clinic.reservationUrl}><Phone size={18} /> 내원 치료 계획 상담</a>
        <small>대표전화 {clinic.phone} · 통화 가능 시간은 내원 전 확인하세요.</small>
      </div>
    </section>
  );
}
