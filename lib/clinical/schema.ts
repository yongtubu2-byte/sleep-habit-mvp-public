export type SleepSnapshot = {
  bedtime?: string;
  wakeTime?: string;
  sleepOnsetMinutes?: number;
  awakenings?: number;
  totalSleepMinutes?: number;
  morningRecovery0to10?: number;
  daytimeSleepiness0to10?: number;
  nocturiaCount?: number;
  snoringOrWitnessedApnea?: boolean;
};

export type HealthyAgingSnapshot = {
  fallsPast12Months?: number;
  timedUpAndGoSeconds?: number;
  sitToStand30sCount?: number;
  pain0to10?: number;
  fatigue0to10?: number;
  appetite0to10?: number;
  bowelConcern?: string;
  medicationCount?: number;
  activityMinutesPerDay?: number;
  weightKg?: number;
};

export type TreatmentSnapshot = {
  acupuncture?: boolean;
  electroacupuncture?: boolean;
  cupping?: boolean;
  chuna?: boolean;
  pharmacopuncture?: boolean;
  herbalMedicine?: boolean;
  note?: string;
};

export type ClinicalCheckpoint = {
  date: string;
  phase: "baseline" | "2w" | "4w" | "8w" | "12w" | "other";
  sleep?: SleepSnapshot;
  aging?: HealthyAgingSnapshot;
  treatment?: TreatmentSnapshot;
  patientReportedChange?: string;
};

export type ClinicalCase = {
  caseId: string;
  ageBand: "20s" | "30s" | "40s" | "50s" | "60s" | "70s" | "80plus";
  sex?: "male" | "female" | "other" | "unknown";
  concerns: string[];
  checkpoints: ClinicalCheckpoint[];
  source: "synthetic" | "local_pseudonymized";
};

export type ValidationIssue = {
  field: string;
  message: string;
};

export function validateClinicalCase(input: ClinicalCase): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!/^CASE-[A-Z0-9-]{4,}$/.test(input.caseId)) {
    issues.push({
      field: "caseId",
      message: "caseId must use a non-identifying CASE-* identifier.",
    });
  }

  if (input.concerns.length === 0) {
    issues.push({ field: "concerns", message: "At least one concern is required." });
  }

  if (input.checkpoints.length === 0) {
    issues.push({
      field: "checkpoints",
      message: "At least one longitudinal checkpoint is required.",
    });
  }

  for (const [index, checkpoint] of input.checkpoints.entries()) {
    const prefix = `checkpoints[${index}]`;

    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(checkpoint.date)) {
      issues.push({
        field: `${prefix}.date`,
        message: "Date must be YYYY-MM-DD.",
      });
    }

    const bounded = [
      ["sleep.morningRecovery0to10", checkpoint.sleep?.morningRecovery0to10],
      ["sleep.daytimeSleepiness0to10", checkpoint.sleep?.daytimeSleepiness0to10],
      ["aging.pain0to10", checkpoint.aging?.pain0to10],
      ["aging.fatigue0to10", checkpoint.aging?.fatigue0to10],
      ["aging.appetite0to10", checkpoint.aging?.appetite0to10],
    ] as const;

    for (const [field, value] of bounded) {
      if (value !== undefined && (value < 0 || value > 10)) {
        issues.push({
          field: `${prefix}.${field}`,
          message: "Value must be between 0 and 10.",
        });
      }
    }
  }

  return issues;
}
