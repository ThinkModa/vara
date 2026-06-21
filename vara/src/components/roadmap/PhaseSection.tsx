import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight, BorderRadius, Spacing, Shadow } from '../../constants/spacing';
import type { RoadmapPhase, StepStatus } from '../../types/roadmap';
import type { StepStatusMap } from './roadmapLogic';
import { getPhaseProgress, isStepEnabled, isStepVisible } from './roadmapLogic';
import { StepRow } from './StepRow';

interface PhaseSectionProps {
  phase: RoadmapPhase;
  statuses: StepStatusMap;
  expanded: boolean;
  expandedStepId: string | null;
  onTogglePhase: (phaseNumber: number) => void;
  onToggleStep: (stepId: string) => void;
  onStatusChange: (stepId: string, status: StepStatus) => void;
}

export const PhaseSection: React.FC<PhaseSectionProps> = ({
  phase,
  statuses,
  expanded,
  expandedStepId,
  onTogglePhase,
  onToggleStep,
  onStatusChange,
}) => {
  const { completed, total } = getPhaseProgress(phase, statuses);
  const visibleSteps = phase.steps.filter((step) => isStepVisible(step, statuses));

  if (visibleSteps.length === 0) return null;

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onTogglePhase(phase.number);
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={[styles.header, expanded && styles.headerExpanded]}
        onPress={handleToggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${phase.title}, ${completed} of ${total} complete`}
        accessibilityState={{ expanded }}
      >
        <View style={styles.headerLeft}>
          <View style={styles.phaseNumber}>
            <Text style={styles.phaseNumberText}>{phase.number}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.phaseTitle}>{phase.title}</Text>
            <Text style={styles.phaseDescription}>{phase.description}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.phaseProgress}>
            {completed}/{total}
          </Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={Colors.textTertiary}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.stepsContainer}>
          {visibleSteps.map((step) => {
            const status = statuses[step.id] ?? step.status;
            return (
              <StepRow
                key={step.id}
                step={{ ...step, status }}
                enabled={isStepEnabled(step, statuses)}
                expanded={expandedStepId === step.id}
                onToggleExpand={onToggleStep}
                onStatusChange={onStatusChange}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  headerExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  phaseNumber: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.phase2Bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseNumberText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.phase2Text,
  },
  headerText: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  phaseDescription: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  phaseProgress: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.accentPrimary,
  },
  stepsContainer: {
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.border,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    padding: Spacing.sm,
    paddingTop: Spacing.md,
  },
});
