import type { ClinicalCase } from "@/lib/clinical/schema";

export const syntheticClinicalCase: ClinicalCase = {
  caseId: "CASE-DEMO-001",
  ageBand: "60s",
  sex: "male",
  concerns: ["수면유지", "야간뇨", "허리통증"],
  source: "synthetic",
  checkpoints: [
    {
      date: "2026-09-01",
      phase: "baseline",
      sleep: {
        bedtime: "23:30",
        wakeTime: "06:30",
        sleepOnsetMinutes: 35,
        awakenings: 4,
        totalSleepMinutes: 310,
        morningRecovery0to10: 4,
        daytimeSleepiness0to10: 5,
        nocturiaCount: 3,
        snoringOrWitnessedApnea: false,
      },
      aging: {
        fallsPast12Months: 0,
        pain0to10: 7,
        fatigue0to10: 7,
        appetite0to10: 6,
        medicationCount: 4,
        activityMinutesPerDay: 20,
      },
      treatment: {
        acupuncture: true,
        chuna: true,
        herbalMedicine: true,
      },
    },
    {
      date: "2026-09-29",
      phase: "4w",
      sleep: {
        bedtime: "23:20",
        wakeTime: "06:30",
        sleepOnsetMinutes: 25,
        awakenings: 2,
        totalSleepMinutes: 355,
        morningRecovery0to10: 6,
        daytimeSleepiness0to10: 3,
        nocturiaCount: 1,
        snoringOrWitnessedApnea: false,
      },
      aging: {
        fallsPast12Months: 0,
        pain0to10: 3,
        fatigue0to10: 5,
        appetite0to10: 7,
        medicationCount: 4,
        activityMinutesPerDay: 35,
      },
      treatment: {
        acupuncture: true,
        chuna: true,
        herbalMedicine: true,
      },
      patientReportedChange: "밤에 깨는 횟수와 허리 통증이 줄었다고 보고함",
    },
  ],
};

export const syntheticPrivacyInputs = [
  {
    caseId: "CASE-DEMO-PII-001",
    text:
      "김테스트 환자 010-0000-0000, test@example.com. 경기도 안성시 공도읍 123 거주. 밤에 세 번 깬다.",
    context: {
      names: ["김테스트"],
      locations: ["공도읍"],
    },
  },
  {
    caseId: "CASE-DEMO-PII-002",
    text:
      "박가상 보호자 연락처 031-000-0000. 회사 근무 중 최근 졸림이 심해졌다.",
    context: {
      names: ["박가상"],
    },
  },
] as const;
