export interface AppUser {
  name: string;
  email: string;
  age: number;
  timeTrying: string;
  diagnosis: string;
  treatmentStage: string;
  partner: string;
  clinic: string;
  doctor: string;
  focusGoal: string;
}

export interface Medication {
  name: string;
  time: string;
  taken: boolean;
}

export interface LoginPayload {
  name?: string;
  email: string;
  isSignup: boolean;
}

export interface OnboardingAnswers {
  timeTrying: string;
  treatmentStage: string;
  focusGoal: string;
}
