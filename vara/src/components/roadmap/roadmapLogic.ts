import type {
  RoadmapIntakeAnswers,
  RoadmapPhase,
  RoadmapProgress,
  RoadmapStep,
  StepStatus,
} from '../../types/roadmap';
import { createInitialPhases } from './roadmapData';

export type StepStatusMap = Record<string, StepStatus>;

const RESOLVED_STATUSES: StepStatus[] = ['done', 'skipped', 'not_applicable'];

export function isStepResolved(status: StepStatus): boolean {
  return RESOLVED_STATUSES.includes(status);
}

export function isStepVisible(step: RoadmapStep, statuses: StepStatusMap): boolean {
  if (!step.skipIf?.length) return true;
  return !step.skipIf.some((condition) => statuses[condition.stepId] === condition.status);
}

export function isStepEnabled(step: RoadmapStep, statuses: StepStatusMap): boolean {
  if (!step.dependsOn?.length) return true;
  return step.dependsOn.every((depId) => isStepResolved(statuses[depId] ?? 'not_started'));
}

export function applyStatusesToPhases(
  phases: RoadmapPhase[],
  statuses: StepStatusMap
): RoadmapPhase[] {
  return phases.map((phase) => ({
    ...phase,
    steps: phase.steps.map((step) => ({
      ...step,
      status: statuses[step.id] ?? step.status,
    })),
  }));
}

export function getVisibleSteps(phases: RoadmapPhase[], statuses: StepStatusMap): RoadmapStep[] {
  return phases.flatMap((phase) =>
    phase.steps.filter((step) => isStepVisible(step, statuses))
  );
}

export function getProgress(phases: RoadmapPhase[], statuses: StepStatusMap): RoadmapProgress {
  const visible = getVisibleSteps(phases, statuses);
  const completed = visible.filter((step) => {
    const status = statuses[step.id] ?? step.status;
    return status !== 'not_started';
  }).length;
  const total = visible.length;
  const remaining = total - completed;

  return {
    completed,
    total,
    remaining,
    percent: total > 0 ? completed / total : 0,
  };
}

export function getPhaseProgress(
  phase: RoadmapPhase,
  statuses: StepStatusMap
): { completed: number; total: number } {
  const visible = phase.steps.filter((step) => isStepVisible(step, statuses));
  const completed = visible.filter((step) => {
    const status = statuses[step.id] ?? step.status;
    return status !== 'not_started';
  }).length;

  return { completed, total: visible.length };
}

export function getCurrentPhase(phases: RoadmapPhase[], statuses: StepStatusMap): RoadmapPhase {
  for (const phase of phases) {
    const visible = phase.steps.filter((step) => isStepVisible(step, statuses));
    const hasIncomplete = visible.some((step) => {
      const status = statuses[step.id] ?? step.status;
      return !isStepResolved(status);
    });
    if (hasIncomplete) return phase;
  }
  return phases[phases.length - 1];
}

export function getAgeFlagMessages(
  phases: RoadmapPhase[],
  userAge: number
): string[] {
  const messages: string[] = [];
  for (const phase of phases) {
    for (const step of phase.steps) {
      if (step.ageFlag && userAge >= step.ageFlag.minAge) {
        messages.push(step.ageFlag.message);
      }
    }
  }
  return [...new Set(messages)];
}

export function applyIntakeAnswers(intake: RoadmapIntakeAnswers): StepStatusMap {
  const statuses: StepStatusMap = {};
  const allSteps = createInitialPhases().flatMap((p) => p.steps);

  for (const step of allSteps) {
    statuses[step.id] = 'not_started';
  }

  if (intake.age >= 35) {
    statuses['trying-duration'] = 'done';
  }

  if (intake.diagnoses.includes('pcos') || intake.diagnoses.includes('endometriosis')) {
    statuses['underlying-conditions'] = 'done';
  }

  if (intake.priorTesting.includes('semen_analysis')) {
    statuses['semen-analysis'] = 'done';
  }

  if (intake.priorTesting.includes('hormone_panel')) {
    statuses['hormone-panel'] = 'done';
  }

  if (intake.priorTesting.includes('hsg')) {
    statuses['tubal-check'] = 'done';
  }

  if (intake.priorTesting.includes('none') && intake.diagnoses.includes('none')) {
    // no pre-marking beyond age
  }

  const markDone = (ids: string[]) => {
    for (const id of ids) {
      if (statuses[id] !== undefined) statuses[id] = 'done';
    }
  };

  switch (intake.treatmentStage) {
    case 'just_starting':
      markDone(['prenatal-vitamin']);
      break;
    case 'diagnostics':
      markDone([
        'trying-duration',
        'fertile-window',
        'ovulating',
        'prenatal-vitamin',
        'healthy-weight',
        'lifestyle-factors',
      ]);
      break;
    case 'first_line':
      markDone([
        'trying-duration',
        'fertile-window',
        'ovulating',
        'prenatal-vitamin',
        'healthy-weight',
        'lifestyle-factors',
        'semen-analysis',
        'hormone-panel',
        'tubal-check',
        'uterine-check',
        'underlying-conditions',
      ]);
      break;
    case 'iui':
      markDone([
        'trying-duration',
        'fertile-window',
        'ovulating',
        'prenatal-vitamin',
        'healthy-weight',
        'lifestyle-factors',
        'semen-analysis',
        'hormone-panel',
        'tubal-check',
        'uterine-check',
        'underlying-conditions',
        'timed-intercourse',
        'ovulation-induction',
      ]);
      break;
    case 'ivf':
      markDone([
        'trying-duration',
        'fertile-window',
        'ovulating',
        'prenatal-vitamin',
        'healthy-weight',
        'lifestyle-factors',
        'semen-analysis',
        'hormone-panel',
        'tubal-check',
        'uterine-check',
        'underlying-conditions',
        'timed-intercourse',
        'ovulation-induction',
        'male-factor-treatment',
        'iui',
        'iui-plus-meds',
        'surgical-correction',
      ]);
      statuses['ivf'] = 'in_progress';
      break;
  }

  return statuses;
}

export function statusesToMap(phases: RoadmapPhase[]): StepStatusMap {
  const map: StepStatusMap = {};
  for (const phase of phases) {
    for (const step of phase.steps) {
      map[step.id] = step.status;
    }
  }
  return map;
}
