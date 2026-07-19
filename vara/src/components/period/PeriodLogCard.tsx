import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/spacing';
import { FLOW_OPTIONS, FlowIntensity } from '../../types/cycle';
import { formatDisplayDate } from '../../utils/cycleCalculations';

interface PeriodLogCardProps {
  isOnPeriod: boolean;
  todayISO: string;
  currentFlow: FlowIntensity | null;
  nextPeriodISO: string;
  daysUntilNextPeriod: number;
  averageCycleLength: number;
  periodStartISO: string | null;
  onLogStart: () => void;
  onLogEnd: () => void;
  onSetFlow: (flow: FlowIntensity) => void;
}

export const PeriodLogCard: React.FC<PeriodLogCardProps> = ({
  isOnPeriod,
  todayISO,
  currentFlow,
  nextPeriodISO,
  daysUntilNextPeriod,
  averageCycleLength,
  periodStartISO,
  onLogStart,
  onLogEnd,
  onSetFlow,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Period logging</Text>
      <Text style={styles.subtitle}>
        {isOnPeriod
          ? periodStartISO
            ? `Period started ${formatDisplayDate(periodStartISO)}`
            : 'Period in progress'
          : `Next period expected ${formatDisplayDate(nextPeriodISO)}`}
      </Text>

      <View style={styles.actions}>
        {!isOnPeriod ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onLogStart}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Log period start"
          >
            <Ionicons name="water" size={18} color={Colors.textWhite} />
            <Text style={styles.primaryButtonText}>Period started</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onLogEnd}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Log period end"
          >
            <Ionicons name="checkmark-circle-outline" size={18} color={Colors.phase1Text} />
            <Text style={styles.secondaryButtonText}>Period ended</Text>
          </TouchableOpacity>
        )}
      </View>

      {isOnPeriod && (
        <View style={styles.flowSection}>
          <Text style={styles.flowLabel}>Flow today ({formatDisplayDate(todayISO)})</Text>
          <View style={styles.flowRow}>
            {FLOW_OPTIONS.map((option) => {
              const selected = currentFlow === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.flowChip, selected && styles.flowChipSelected]}
                  onPress={() => onSetFlow(option.value)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`Flow ${option.label}`}
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.flowChipText, selected && styles.flowChipTextSelected]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.predictionStrip}>
        <View style={styles.predictionItem}>
          <Text style={styles.predictionValue}>
            {daysUntilNextPeriod === 0 ? 'Today' : `${daysUntilNextPeriod}d`}
          </Text>
          <Text style={styles.predictionLabel}>Until next period</Text>
        </View>
        <View style={styles.predictionDivider} />
        <View style={styles.predictionItem}>
          <Text style={styles.predictionValue}>{averageCycleLength}d</Text>
          <Text style={styles.predictionLabel}>Avg cycle</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  actions: {
    marginBottom: Spacing.md,
  },
  primaryButton: {
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.accentTertiary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  primaryButtonText: {
    color: Colors.textWhite,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  secondaryButton: {
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.phase1Bg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#F9A8D4',
  },
  secondaryButtonText: {
    color: Colors.phase1Text,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  flowSection: {
    marginBottom: Spacing.md,
  },
  flowLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  flowRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  flowChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  flowChipSelected: {
    backgroundColor: Colors.phase1Bg,
    borderColor: Colors.phase1Text,
  },
  flowChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  flowChipTextSelected: {
    color: Colors.phase1Text,
    fontWeight: FontWeight.semibold,
  },
  predictionStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.phase2Bg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  predictionItem: {
    flex: 1,
    alignItems: 'center',
  },
  predictionDivider: {
    width: 1,
    backgroundColor: 'rgba(109, 40, 217, 0.2)',
  },
  predictionValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.phase2Text,
  },
  predictionLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
