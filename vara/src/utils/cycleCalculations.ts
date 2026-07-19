import type {
  CyclePhase,
  CycleProfile,
  DerivedCycleState,
  FlowIntensity,
  PeriodCycleSeed,
  PeriodDay,
  SymptomLog,
} from '../types/cycle';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Period / natural-cycle UX (vs IVF stim monitoring).
 * Driven by main goal first, then treatment stage.
 */
export function isNaturalTracking(treatmentStage: string, mainGoal?: string): boolean {
  const goal = (mainGoal ?? '').toLowerCase();
  if (goal.includes('tracking my period') || goal === 'other') {
    return true;
  }
  const stage = treatmentStage.toLowerCase();
  return (
    stage.includes('tracking naturally') ||
    stage.includes('tracking my period') ||
    stage === 'exploring' ||
    stage === 'naturally'
  );
}

export function toDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateISO(dateISO: string): Date {
  const [y, m, d] = dateISO.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDaysISO(dateISO: string, days: number): string {
  const date = parseDateISO(dateISO);
  date.setDate(date.getDate() + days);
  return toDateISO(date);
}

export function daysBetween(startISO: string, endISO: string): number {
  const start = parseDateISO(startISO);
  const end = parseDateISO(endISO);
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
}

export function todayISO(): string {
  return toDateISO(new Date());
}

export function formatDisplayDate(dateISO: string): string {
  const date = parseDateISO(dateISO);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Simple phase model for a typical cycle. */
export function getPhaseForDay(
  currentDay: number,
  cycleLength: number,
  periodLength: number
): CyclePhase {
  if (currentDay <= periodLength) {
    return 'Menstrual';
  }
  const ovulationDay = Math.max(periodLength + 1, cycleLength - 14);
  if (currentDay < ovulationDay - 1) {
    return 'Follicular';
  }
  if (currentDay <= ovulationDay + 1) {
    return 'Ovulatory';
  }
  return 'Luteal';
}

export function getLatestPeriodStart(periodDays: PeriodDay[]): string | null {
  if (periodDays.length === 0) {
    return null;
  }
  const sorted = [...periodDays].sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  // Walk backwards to find contiguous bleed start of the most recent stretch
  let start = sorted[sorted.length - 1].dateISO;
  for (let i = sorted.length - 2; i >= 0; i -= 1) {
    const prev = sorted[i].dateISO;
    if (daysBetween(prev, start) === 1) {
      start = prev;
    } else {
      break;
    }
  }
  return start;
}

export function getLatestPeriodEnd(periodDays: PeriodDay[], startISO: string | null): string | null {
  if (!startISO || periodDays.length === 0) {
    return null;
  }
  const sorted = [...periodDays]
    .filter((d) => d.dateISO >= startISO)
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  if (sorted.length === 0) {
    return null;
  }
  let end = sorted[0].dateISO;
  for (let i = 1; i < sorted.length; i += 1) {
    if (daysBetween(end, sorted[i].dateISO) === 1) {
      end = sorted[i].dateISO;
    } else {
      break;
    }
  }
  return end;
}

export function deriveCycleState(
  profile: CycleProfile,
  periodDays: PeriodDay[],
  asOfISO: string = todayISO()
): DerivedCycleState {
  const periodStart =
    getLatestPeriodStart(periodDays) ?? profile.lastPeriodStartISO;
  const periodEnd = getLatestPeriodEnd(periodDays, periodStart);
  const currentDay = Math.max(1, daysBetween(periodStart, asOfISO) + 1);
  const totalDays = profile.averageCycleLength;
  const phase = getPhaseForDay(currentDay, totalDays, profile.averagePeriodLength);
  const nextPeriodISO = addDaysISO(periodStart, totalDays);
  const daysUntilNextPeriod = Math.max(0, daysBetween(asOfISO, nextPeriodISO));
  const isOnPeriod =
    periodDays.some((d) => d.dateISO === asOfISO) ||
    (currentDay <= profile.averagePeriodLength && asOfISO >= periodStart);

  return {
    currentDay: Math.min(currentDay, totalDays + 7),
    totalDays,
    phase,
    nextPeriodISO,
    daysUntilNextPeriod,
    isOnPeriod,
    periodStartISO: periodStart,
    periodEndISO: periodEnd,
  };
}

export function buildPeriodDaysForRange(
  startISO: string,
  length: number,
  defaultFlow: FlowIntensity = 'medium'
): PeriodDay[] {
  const days: PeriodDay[] = [];
  for (let i = 0; i < length; i += 1) {
    const flow: FlowIntensity =
      i === 0 ? 'light' : i === length - 1 ? 'spotting' : defaultFlow;
    days.push({ dateISO: addDaysISO(startISO, i), flow });
  }
  return days;
}

export function parseCycleLengthOption(option: string): {
  averageCycleLength: number;
  regularity: CycleProfile['regularity'];
} {
  if (option === 'Irregular') {
    return { averageCycleLength: 28, regularity: 'irregular' };
  }
  const match = option.match(/(\d+)/);
  return {
    averageCycleLength: match ? Number(match[1]) : 28,
    regularity: 'regular',
  };
}

export function parseLastPeriodOption(option: string, asOfISO: string = todayISO()): string {
  switch (option) {
    case 'Today':
      return asOfISO;
    case 'Yesterday':
      return addDaysISO(asOfISO, -1);
    case '3 days ago':
      return addDaysISO(asOfISO, -3);
    case 'About a week ago':
      return addDaysISO(asOfISO, -7);
    case 'Not sure':
    default:
      return addDaysISO(asOfISO, -8);
  }
}

export function buildSeedFromOnboarding(answers: {
  cycleLength?: string;
  lastPeriodStart?: string;
}): PeriodCycleSeed {
  const { averageCycleLength, regularity } = parseCycleLengthOption(
    answers.cycleLength ?? '28 days'
  );
  const lastPeriodStartISO = parseLastPeriodOption(answers.lastPeriodStart ?? 'Not sure');
  const averagePeriodLength = 5;
  const previousStart = addDaysISO(lastPeriodStartISO, -averageCycleLength);

  return {
    profile: {
      averageCycleLength,
      averagePeriodLength,
      lastPeriodStartISO,
      regularity,
    },
    periodDays: [
      ...buildPeriodDaysForRange(previousStart, averagePeriodLength),
      ...buildPeriodDaysForRange(lastPeriodStartISO, Math.min(averagePeriodLength, Math.max(1, daysBetween(lastPeriodStartISO, todayISO()) + 1))),
    ],
    symptomLogs: [
      {
        dateISO: lastPeriodStartISO,
        symptoms: ['Light cramping', 'Fatigue'],
      },
    ],
  };
}

export function getSymptomsForDate(logs: SymptomLog[], dateISO: string): string[] {
  return logs.find((log) => log.dateISO === dateISO)?.symptoms ?? [];
}

export function getFlowForDate(periodDays: PeriodDay[], dateISO: string): FlowIntensity | null {
  return periodDays.find((d) => d.dateISO === dateISO)?.flow ?? null;
}

export function getPhaseColors(phase: CyclePhase): { bg: string; text: string } {
  switch (phase) {
    case 'Menstrual':
      return { bg: '#FDE8EF', text: '#BE185D' };
    case 'Follicular':
      return { bg: '#EDE9FE', text: '#6D28D9' };
    case 'Ovulatory':
      return { bg: '#DBEAFE', text: '#1D4ED8' };
    case 'Luteal':
      return { bg: '#D1FAE5', text: '#166534' };
    default:
      return { bg: '#EDE9FE', text: '#6D28D9' };
  }
}

export function getPhaseGradient(phase: string): { start: string; end: string } {
  switch (phase) {
    case 'Menstrual':
      return { start: '#F472B6', end: '#EC4899' };
    case 'Follicular':
      return { start: '#667eea', end: '#8B5CF6' };
    case 'Ovulatory':
      return { start: '#4facfe', end: '#00f2fe' };
    case 'Luteal':
      return { start: '#34D399', end: '#10B981' };
    default:
      return { start: '#667eea', end: '#EC4899' };
  }
}
