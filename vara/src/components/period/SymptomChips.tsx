import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/spacing';
import { SYMPTOM_OPTIONS } from '../../types/cycle';
import { formatDisplayDate } from '../../utils/cycleCalculations';

interface SymptomChipsProps {
  selected: string[];
  onToggle: (symptom: string) => void;
  recentLogs?: { dateISO: string; symptoms: string[] }[];
}

export const SymptomChips: React.FC<SymptomChipsProps> = ({
  selected,
  onToggle,
  recentLogs = [],
}) => {
  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.title}>How are you feeling today?</Text>
        <Text style={styles.subtitle}>Tap all that apply — you can update anytime.</Text>
        <View style={styles.chipRow}>
          {SYMPTOM_OPTIONS.map((symptom) => {
            const isSelected = selected.includes(symptom);
            return (
              <TouchableOpacity
                key={symptom}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => onToggle(symptom)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={symptom}
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {symptom}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {recentLogs.length > 0 && (
        <View style={styles.recentCard}>
          <Text style={styles.recentTitle}>Recent logs</Text>
          {recentLogs.map((log) => (
            <View key={log.dateISO} style={styles.recentRow}>
              <Text style={styles.recentDate}>{formatDisplayDate(log.dateISO)}</Text>
              <Text style={styles.recentSymptoms}>{log.symptoms.join(' · ')}</Text>
            </View>
          ))}
        </View>
      )}
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.phase2Bg,
    borderColor: Colors.phase2Text,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.phase2Text,
    fontWeight: FontWeight.semibold,
  },
  recentCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  recentTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  recentRow: {
    marginBottom: Spacing.sm,
  },
  recentDate: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
  },
  recentSymptoms: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 20,
  },
});
