import type { AssessmentResult } from "@/lib/assessment";
import type {
  SleepDomainId,
  SleepHabitAssessmentSnapshot,
  SleepRiskId,
} from "@/lib/clinical/schema";

export function assessmentResultToSnapshot(
  result: AssessmentResult,
): SleepHabitAssessmentSnapshot {
  return {
    total: result.total,
    domainScores: { ...result.domainScores } as Record<SleepDomainId, number>,
    risks: [...result.risks] as SleepRiskId[],
  };
}
