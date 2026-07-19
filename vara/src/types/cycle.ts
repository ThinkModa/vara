export type FlowIntensity = 'spotting' | 'light' | 'medium' | 'heavy';

export type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal';

export type CycleRegularity = 'regular' | 'irregular';

export interface PeriodDay {
  dateISO: string;
  flow: FlowIntensity;
}

export interface SymptomLog {
  dateISO: string;
  symptoms: string[];
}

export interface CycleProfile {
  averageCycleLength: number;
  averagePeriodLength: number;
  lastPeriodStartISO: string;
  regularity: CycleRegularity;
}

export interface PeriodCycleSeed {
  profile: CycleProfile;
  periodDays: PeriodDay[];
  symptomLogs: SymptomLog[];
}

export interface DerivedCycleState {
  currentDay: number;
  totalDays: number;
  phase: CyclePhase;
  nextPeriodISO: string;
  daysUntilNextPeriod: number;
  isOnPeriod: boolean;
  periodStartISO: string | null;
  periodEndISO: string | null;
}

export const SYMPTOM_OPTIONS = [
  'Mild bloating',
  'Light cramping',
  'Fatigue',
  'Headache',
  'Mood changes',
  'Breast tenderness',
  'Back pain',
  'Nausea',
] as const;

export const FLOW_OPTIONS: { value: FlowIntensity; label: string }[] = [
  { value: 'spotting', label: 'Spotting' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
];
