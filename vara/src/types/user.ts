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

export type AppointmentType =
  | 'Ultrasound'
  | 'Blood draw'
  | 'Consult'
  | 'Procedure'
  | 'Other';

export type AppointmentStatus = 'scheduled' | 'cancelled';

export interface Appointment {
  id: string;
  title: string;
  /** YYYY-MM-DD for sorting and display */
  dateISO: string;
  timeLabel: string;
  location: string;
  type: AppointmentType;
  notes?: string;
  status: AppointmentStatus;
}
