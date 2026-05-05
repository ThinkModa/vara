import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../constants/spacing';
import { OnboardingAnswers } from '../types/user';

interface OnboardingScreenProps {
  onComplete: (answers: OnboardingAnswers) => void;
}

const QUESTION_STEPS = [
  {
    key: 'timeTrying' as const,
    title: 'How long have you been trying to conceive?',
    subtitle: 'Take your time - this helps personalize your experience.',
    options: ['Just getting started', 'Under 6 months', '6-12 months', 'More than 12 months'],
  },
  {
    key: 'treatmentStage' as const,
    title: 'What stage are you currently in?',
    subtitle: 'We will tune your dashboard and insights for this phase.',
    options: ['Tracking naturally', 'IUI', 'IVF cycle 1', 'IVF cycle 2+'],
  },
  {
    key: 'focusGoal' as const,
    title: 'What support matters most right now?',
    subtitle: 'You can update this later in Profile.',
    options: ['Medication reminders', 'Symptom tracking', 'Understanding labs', 'Emotional support'],
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});

  const activeStep = QUESTION_STEPS[step];
  const selectedValue = answers[activeStep.key];
  const progress = useMemo(() => ((step + 1) / QUESTION_STEPS.length) * 100, [step]);

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [activeStep.key]: value,
    }));
  };

  const handleContinue = () => {
    if (!selectedValue) {
      return;
    }

    if (step < QUESTION_STEPS.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    onComplete(answers as OnboardingAnswers);
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
          <Text style={styles.kicker}>Step {step + 1} of {QUESTION_STEPS.length}</Text>
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
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option}</Text>
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
          accessibilityLabel={step === QUESTION_STEPS.length - 1 ? 'Finish onboarding' : 'Continue'}
        >
          <Text style={styles.continueText}>
            {step === QUESTION_STEPS.length - 1 ? 'Finish' : 'Continue'}
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
