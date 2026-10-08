import type { ClinicalCase } from "@/lib/clinical/schema";

export type CloudClinicalCheckpoint = {
  phase: ClinicalCase["checkpoints"][number]["phase"];
  sleep?: {
    sleepOnsetMinutes?: number;
    awakenings?: number;
    totalSleepMinutes?: number;
    morningRecovery0to10?: number;
    daytimeSleepiness0to10?: number;
    nocturiaCount?: number;
    snoringOrWitnessedApnea?: boolean;
  };
  aging?: {
    fallsPast12Months?: number;
    timedUpAndGoSeconds?: number;
    sitToStand30sCount?: number;
    pain0to10?: number;
    fatigue0to10?: number;
    appetite0to10?: number;
    medicationCount?: number;
    activityMinutesPerDay?: number;
    weightKg?: number;
  };
  treatment?: {
    acupuncture?: boolean;
    electroacupuncture?: boolean;
    cupping?: boolean;
    chuna?: boolean;
    pharmacopuncture?: boolean;
    herbalMedicine?: boolean;
  };
};

export type CloudClinicalPayload = {
  caseId: string;
  ageBand: ClinicalCase["ageBand"];
  sex?: ClinicalCase["sex"];
  checkpoints: CloudClinicalCheckpoint[];
  privacy: {
    pseudonymized: true;
    rawTextIncluded: false;
    exactDatesIncluded: false;
    freeTextIncluded: false;
  };
};

/**
 * Data-minimized payload for optional cloud analysis.
 *
 * Intentionally excludes:
 * - names and identifiers
 * - exact visit dates
 * - raw transcripts
 * - patientReportedChange free text
 * - treatment notes
 * - bowelConcern free text
 * - concern labels/free text
 *
 * This is a structural safeguard, not a declaration that the result is anonymous.
 */
export function buildCloudClinicalPayload(input: ClinicalCase): CloudClinicalPayload {
  if (!/^CASE-[A-Z0-9-]{4,}$/.test(input.caseId)) {
    throw new Error("A pseudonymous CASE-* identifier is required before cloud handoff.");
  }

  return {
    caseId: input.caseId,
    ageBand: input.ageBand,
    sex: input.sex,
    checkpoints: input.checkpoints.map((checkpoint) => ({
      phase: checkpoint.phase,
      sleep: checkpoint.sleep
        ? {
            sleepOnsetMinutes: checkpoint.sleep.sleepOnsetMinutes,
            awakenings: checkpoint.sleep.awakenings,
            totalSleepMinutes: checkpoint.sleep.totalSleepMinutes,
            morningRecovery0to10: checkpoint.sleep.morningRecovery0to10,
            daytimeSleepiness0to10: checkpoint.sleep.daytimeSleepiness0to10,
            nocturiaCount: checkpoint.sleep.nocturiaCount,
            snoringOrWitnessedApnea: checkpoint.sleep.snoringOrWitnessedApnea,
          }
        : undefined,
      aging: checkpoint.aging
        ? {
            fallsPast12Months: checkpoint.aging.fallsPast12Months,
            timedUpAndGoSeconds: checkpoint.aging.timedUpAndGoSeconds,
            sitToStand30sCount: checkpoint.aging.sitToStand30sCount,
            pain0to10: checkpoint.aging.pain0to10,
            fatigue0to10: checkpoint.aging.fatigue0to10,
            appetite0to10: checkpoint.aging.appetite0to10,
            medicationCount: checkpoint.aging.medicationCount,
            activityMinutesPerDay: checkpoint.aging.activityMinutesPerDay,
            weightKg: checkpoint.aging.weightKg,
          }
        : undefined,
      treatment: checkpoint.treatment
        ? {
            acupuncture: checkpoint.treatment.acupuncture,
            electroacupuncture: checkpoint.treatment.electroacupuncture,
            cupping: checkpoint.treatment.cupping,
            chuna: checkpoint.treatment.chuna,
            pharmacopuncture: checkpoint.treatment.pharmacopuncture,
            herbalMedicine: checkpoint.treatment.herbalMedicine,
          }
        : undefined,
    })),
    privacy: {
      pseudonymized: true,
      rawTextIncluded: false,
      exactDatesIncluded: false,
      freeTextIncluded: false,
    },
  };
}
