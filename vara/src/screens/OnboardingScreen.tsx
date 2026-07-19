import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../constants/spacing';
import { OnboardingAnswers } from '../types/user';
import { isNaturalTracking } from '../utils/cycleCalculations';

interface OnboardingScreenProps {
  onComplete: (answers: OnboardingAnswers) => void;
}

type StepKey = keyof OnboardingAnswers;

interface QuestionStep {
  key: StepKey;
  title: string;
  subtitle: string;
  options: string[];
}

const MAIN_GOAL_STEP: QuestionStep = {
  key: 'mainGoal',
  title: 'What is your main goal with the app?',
  subtitle: 'We will personalize Vara around what matters most to you.',
  options: ['Tracking my period', 'Trying to conceive', 'Other'],
};

const TIME_TRYING_STEP: QuestionStep = {
  key: 'timeTrying',
  title: 'How long have you been trying to conceive?',
  subtitle: 'Take your time — this helps personalize your experience.',
  options: ['Just getting started', 'Under 6 months', '6-12 months', 'More than 12 months'],
};

const TREATMENT_STAGE_STEP: QuestionStep = {
  key: 'treatmentStage',
  title: 'What stage are you currently in?',
  subtitle: 'We will tune your dashboard and insights for this phase.',
  options: ['Tracking naturally', 'IUI', 'IVF cycle 1', 'IVF cycle 2+'],
};

const CYCLE_STEPS: QuestionStep[] = [
  {
    key: 'cycleLength',
    title: 'How long is your typical cycle?',
    subtitle: 'Count from the first day of one period to the day before the next.',
    options: ['21 days', '28 days', '30 days', '35 days', 'Irregular'],
  },
  {
    key: 'lastPeriodStart',
    title: 'When did your last period start?',
    subtitle: 'An estimate is fine — you can adjust this later in Tracking.',
    options: ['Today', 'Yesterday', '3 days ago', 'About a week ago', 'Not sure'],
  },
];

const PERIOD_FOCUS_STEP: QuestionStep = {
  key: 'focusGoal',
  title: 'What support matters most right now?',
  subtitle: 'You can update this later in Profile.',
  options: ['Cycle predictions', 'Symptom tracking', 'Understanding my body', 'Emotional support'],
};

const TTC_FOCUS_STEP: QuestionStep = {
  key: 'focusGoal',
  title: 'What support matters most right now?',
  subtitle: 'You can update this later in Profile.',
  options: ['Medication reminders', 'Symptom tracking', 'Understanding labs', 'Emotional support'],
};

const OTHER_FOCUS_STEP: QuestionStep = {
  key: 'focusGoal',
  title: 'What would you like help with?',
  subtitle: 'You can update this later in Profile.',
  options: ['Cycle & period tracking', 'Learning about fertility', 'Emotional support', 'Just exploring'],
};

function buildSteps(answers: Partial<OnboardingAnswers>): QuestionStep[] {
  const goal = answers.mainGoal;

  if (!goal) {
    return [MAIN_GOAL_STEP];
  }

  if (goal === 'Tracking my period') {
    return [MAIN_GOAL_STEP, ...CYCLE_STEPS, PERIOD_FOCUS_STEP];
  }

  if (goal === 'Other') {
    return [MAIN_GOAL_STEP, ...CYCLE_STEPS, OTHER_FOCUS_STEP];
  }

  // Trying to conceive
  const steps: QuestionStep[] = [MAIN_GOAL_STEP, TIME_TRYING_STEP, TREATMENT_STAGE_STEP];
  if (isNaturalTracking(answers.treatmentStage ?? '', goal)) {
    steps.push(...CYCLE_STEPS);
  }
  steps.push(TTC_FOCUS_STEP);
  return steps;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});

  const steps = useMemo(() => buildSteps(answers), [answers]);
  const activeStep = steps[Math.min(step, steps.length - 1)];
  const selectedValue = answers[activeStep.key];
  const progress = useMemo(
    () => ((Math.min(step, steps.length - 1) + 1) / steps.length) * 100,
    [step, steps.length]
  );

  const handleSelect = (value: string) => {
    setAnswers((prev) => {
      const next: Partial<OnboardingAnswers> = { ...prev, [activeStep.key]: value };

      if (activeStep.key === 'mainGoal') {
        // Reset branch-specific answers when goal changes
        delete next.timeTrying;
        delete next.treatmentStage;
        delete next.cycleLength;
        delete next.lastPeriodStart;
        delete next.focusGoal;
      }

      if (activeStep.key === 'treatmentStage' && !isNaturalTracking(value, prev.mainGoal)) {
        delete next.cycleLength;
        delete next.lastPeriodStart;
      }

      return next;
    });
  };

  const handleContinue = () => {
    if (!selectedValue) {
      return;
    }

    const tentative: Partial<OnboardingAnswers> = {
      ...answers,
      [activeStep.key]: selectedValue,
    };
    const nextSteps = buildSteps(tentative);

    if (step < nextSteps.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    const mainGoal = (tentative.mainGoal ?? selectedValue) as string;
    const wantsPeriodQuestions =
      mainGoal === 'Tracking my period' ||
      mainGoal === 'Other' ||
      isNaturalTracking(tentative.treatmentStage ?? '', mainGoal);

    onComplete({
      mainGoal,
      focusGoal: (tentative.focusGoal ?? selectedValue) as string,
      timeTrying:
        mainGoal === 'Trying to conceive'
          ? tentative.timeTrying
          : mainGoal === 'Tracking my period'
            ? 'Not trying'
            : 'N/A',
      treatmentStage:
        mainGoal === 'Trying to conceive'
          ? tentative.treatmentStage
          : mainGoal === 'Tracking my period'
            ? 'Tracking naturally'
            : 'Exploring',
      ...(wantsPeriodQuestions
        ? {
            cycleLength: tentative.cycleLength,
            lastPeriodStart: tentative.lastPeriodStart,
          }
        : {}),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FAFBFD', '#F5F3FF', '#FDE8EF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.content}>
          <Text style={styles.kicker}>
            Step {Math.min(step, steps.length - 1) + 1} of {steps.length}
          </Text>
          <Text style={styles.title}>{activeStep.title}</Text>
          <Text style={styles.subtitle}>{activeStep.subtitle}</Text>

          <View style={styles.optionStack}>
            {activeStep.options.map((option) => {
              const isSelected = selectedValue === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => handleSelect(option)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={option}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !selectedValue && styles.continueDisabled]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!selectedValue}
          accessibilityRole="button"
          accessibilityLabel={step >= steps.length - 1 ? 'Finish onboarding' : 'Continue'}
        >
          <Text style={styles.continueText}>
            {step >= steps.length - 1 ? 'Finish' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.divider,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accentPrimary,
    borderRadius: BorderRadius.full,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  kicker: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  optionStack: {
    gap: Spacing.md,
  },
  optionCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    minHeight: 56,
    justifyContent: 'center',
    ...Shadow.sm,
  },
  optionCardSelected: {
    borderColor: Colors.accentPrimary,
    backgroundColor: '#EEF2FF',
  },
  optionText: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  optionTextSelected: {
    color: Colors.accentPrimary,
    fontWeight: FontWeight.semibold,
  },
  continueButton: {
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  continueDisabled: {
    opacity: 0.4,
  },
  continueText: {
    color: Colors.textWhite,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
