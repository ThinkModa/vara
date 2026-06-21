import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight, BorderRadius, Spacing } from '../../constants/spacing';
import type { StepStatus } from '../../types/roadmap';

interface StepStatusBadgeProps {
  status: StepStatus;
}

const STATUS_CONFIG: Record<
  StepStatus,
  { label: string; bg: string; text: string } | null
> = {
  not_started: null,
  in_progress: { label: "Don't Know", bg: Colors.phase3Bg, text: Colors.phase3Text },
  done: { label: 'Yes', bg: Colors.phase2Bg, text: Colors.phase2Text },
  skipped: { label: 'No', bg: '#FEF2F2', text: Colors.error },
  not_applicable: { label: 'N/A', bg: Colors.divider, text: Colors.textTertiary },
};

export const StepStatusBadge: React.FC<StepStatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.badgeText, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
