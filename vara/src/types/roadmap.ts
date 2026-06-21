export type StepStatus = 'not_started' | 'in_progress' | 'done' | 'skipped' | 'not_applicable';

export interface DontKnowAction {
  label: string;
  deepLink?: string;
}

export interface AgeFlag {
  minAge: number;
  message: string;
}

export interface SkipCondition {
  stepId: string;
  status: StepStatus;
}

export interface RoadmapStep {
  id: string;
  phase: number;
  title: string;
  status: StepStatus;
  helpText?: string;
  dontKnowAction?: DontKnowAction;
  ageFlag?: AgeFlag;
  dependsOn?: string[];
  skipIf?: SkipCondition[];
}

export interface RoadmapPhase {
  number: number;
  title: string;
  description: string;
  steps: RoadmapStep[];
}

export interface RoadmapIntakeAnswers {
  age: number;
  diagnoses: ('pcos' | 'endometriosis' | 'none')[];
  priorTesting: ('semen_analysis' | 'hormone_panel' | 'hsg' | 'none')[];
  treatmentStage: 'just_starting' | 'diagnostics' | 'first_line' | 'iui' | 'ivf';
}

export interface RoadmapProgress {
  completed: number;
  total: number;
  remaining: number;
  percent: number;
}
