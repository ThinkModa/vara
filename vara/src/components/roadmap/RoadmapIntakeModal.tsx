import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '../../constants/spacing';
import type { RoadmapIntakeAnswers } from '../../types/roadmap';

interface RoadmapIntakeModalProps {
  visible: boolean;
  defaultAge: number;
  onComplete: (answers: RoadmapIntakeAnswers) => void;
}

type Step = 'age' | 'diagnoses' | 'testing' | 'stage';

const AGE_OPTIONS = [
  { label: 'Under 30', value: 28 },
  { label: '30–34', value: 32 },
  { label: '35–39', value: 37 },
  { label: '40+', value: 42 },
];

const DIAGNOSIS_OPTIONS: { label: string; value: RoadmapIntakeAnswers['diagnoses'][number] }[] = [
  { label: 'PCOS', value: 'pcos' },
  { label: 'Endometriosis', value: 'endometriosis' },
  { label: 'None / not sure', value: 'none' },
];

const TESTING_OPTIONS: { label: string; value: RoadmapIntakeAnswers['priorTesting'][number] }[] = [
  { label: 'Semen analysis', value: 'semen_analysis' },
  { label: 'Hormone panel', value: 'hormone_panel' },
  { label: 'HSG (tubal check)', value: 'hsg' },
  { label: 'None yet', value: 'none' },
];

const STAGE_OPTIONS: { label: string; subtitle: string; value: RoadmapIntakeAnswers['treatmentStage'] }[] = [
  { label: 'Just starting out', subtitle: 'Still exploring basics', value: 'just_starting' },
  { label: 'In diagnostics', subtitle: 'Getting tests done', value: 'diagnostics' },
  { label: 'First-line treatment', subtitle: 'Clomid, Letrozole, timed intercourse', value: 'first_line' },
  { label: 'IUI', subtitle: 'Intrauterine insemination', value: 'iui' },
  { label: 'IVF', subtitle: 'In vitro fertilization', value: 'ivf' },
];

const STEPS: Step[] = ['age', 'diagnoses', 'testing', 'stage'];

export const RoadmapIntakeModal: React.FC<RoadmapIntakeModalProps> = ({
  visible,
  defaultAge,
  onComplete,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [age, setAge] = useState(defaultAge);
  const [diagnoses, setDiagnoses] = useState<RoadmapIntakeAnswers['diagnoses']>([]);
  const [priorTesting, setPriorTesting] = useState<RoadmapIntakeAnswers['priorTesting']>([]);
  const [treatmentStage, setTreatmentStage] = useState<RoadmapIntakeAnswers['treatmentStage'] | null>(null);

  const currentStep = STEPS[stepIndex];
  const progress = (stepIndex + 1) / STEPS.length;

  const toggleDiagnosis = (value: RoadmapIntakeAnswers['diagnoses'][number]) => {
    if (value === 'none') {
      setDiagnoses(['none']);
      return;
    }
    setDiagnoses((prev) => {
      const without = prev.filter((d) => d !== 'none' && d !== value);
      return prev.includes(value) ? without : [...without, value];
    });
  };

  const toggleTesting = (value: RoadmapIntakeAnswers['priorTesting'][number]) => {
    if (value === 'none') {
      setPriorTesting(['none']);
      return;
    }
    setPriorTesting((prev) => {
      const without = prev.filter((t) => t !== 'none' && t !== value);
      return prev.includes(value) ? without : [...without, value];
    });
  };

  const canContinue = (): boolean => {
    switch (currentStep) {
      case 'age':
        return age > 0;
      case 'diagnoses':
        return diagnoses.length > 0;
      case 'testing':
        return priorTesting.length > 0;
      case 'stage':
        return treatmentStage !== null;
      default:
        return false;
    }
  };

  const handleContinue = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1);
      return;
    }
    if (treatmentStage) {
      onComplete({
        age,
        diagnoses: diagnoses.length ? diagnoses : ['none'],
        priorTesting: priorTesting.length ? priorTesting : ['none'],
        treatmentStage,
      });
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const renderOptions = () => {
    switch (currentStep) {
      case 'age':
        return AGE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.label}
            label={opt.label}
            selected={age === opt.value}
            onPress={() => setAge(opt.value)}
          />
        ));
      case 'diagnoses':
        return DIAGNOSIS_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={diagnoses.includes(opt.value)}
            onPress={() => toggleDiagnosis(opt.value)}
          />
        ));
      case 'testing':
        return TESTING_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={priorTesting.includes(opt.value)}
            onPress={() => toggleTesting(opt.value)}
          />
        ));
      case 'stage':
        return STAGE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            subtitle={opt.subtitle}
            selected={treatmentStage === opt.value}
            onPress={() => setTreatmentStage(opt.value)}
          />
        ));
      default:
        return null;
    }
  };

  const stepTitles: Record<Step, { title: string; subtitle: string }> = {
    age: {
      title: 'How old are you?',
      subtitle: 'Age affects recommended timelines and testing priorities.',
    },
    diagnoses: {
      title: 'Any known diagnoses?',
      subtitle: 'Select all that apply — this helps personalize your roadmap.',
    },
    testing: {
      title: 'What testing have you already done?',
      subtitle: "We'll mark completed steps so you can focus on what's next.",
    },
    stage: {
      title: 'Where are you in treatment?',
      subtitle: 'This helps us jump you to the right starting point.',
    },
  };

  const { title, subtitle } = stepTitles[currentStep];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.stepLabel}>
              Step {stepIndex + 1} of {STEPS.length}
            </Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>

            <View style={styles.options}>{renderOptions()}</View>
          </ScrollView>

          <View style={styles.footer}>
            {stepIndex > 0 ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.backPlaceholder} />
            )}

            <TouchableOpacity
              style={[styles.continueButton, !canContinue() && styles.continueDisabled]}
              onPress={handleContinue}
              disabled={!canContinue()}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={stepIndex === STEPS.length - 1 ? 'Build my roadmap' : 'Continue'}
            >
              <Text style={styles.continueText}>
                {stepIndex === STEPS.length - 1 ? 'Build my roadmap' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface OptionCardProps {
  label: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ label, subtitle, selected, onPress }) => (
  <Pressable
    style={[styles.optionCard, selected && styles.optionCardSelected]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected }}
  >
    <View style={styles.optionContent}>
      <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
      {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
    </View>
    {selected && (
      <Ionicons name="checkmark-circle" size={22} color={Colors.accentPrimary} />
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.bgWhite,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '90%',
    ...Shadow.lg,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.divider,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accentPrimary,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  stepLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.accentPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  options: {
    gap: Spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgWhite,
  },
  optionCardSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.accentPrimary,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  optionLabelSelected: {
    fontWeight: FontWeight.semibold,
    color: Colors.accentPrimary,
  },
  optionSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
  },
  backText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  backPlaceholder: {
    width: 60,
  },
  continueButton: {
    flex: 1,
    marginLeft: Spacing.md,
    backgroundColor: Colors.accentPrimary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  continueDisabled: {
    opacity: 0.4,
  },
  continueText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textWhite,
  },
});
