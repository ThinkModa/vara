import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight, BorderRadius, Spacing, Shadow } from '../../constants/spacing';
import type { RoadmapStep, StepStatus } from '../../types/roadmap';
import { StepStatusBadge } from './StepStatusBadge';
import { DontKnowAction } from './DontKnowAction';

interface StepRowProps {
  step: RoadmapStep;
  enabled: boolean;
  expanded: boolean;
  onToggleExpand: (stepId: string) => void;
  onStatusChange: (stepId: string, status: StepStatus) => void;
}

function getStatusIcon(status: StepStatus, enabled: boolean): {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
} {
  if (!enabled) {
    return { name: 'ellipse-outline', color: Colors.textTertiary };
  }
  switch (status) {
    case 'done':
      return { name: 'checkmark-circle', color: Colors.accentPrimary };
    case 'in_progress':
      return { name: 'help-circle', color: Colors.warning };
    case 'skipped':
      return { name: 'close-circle-outline', color: Colors.textSecondary };
    case 'not_applicable':
      return { name: 'remove-circle-outline', color: Colors.textTertiary };
    default:
      return { name: 'ellipse-outline', color: Colors.textTertiary };
  }
}

const STATUS_OPTIONS: { value: StepStatus; label: string }[] = [
  { value: 'done', label: 'Yes' },
  { value: 'skipped', label: 'No' },
  { value: 'in_progress', label: "Don't Know" },
];

export const StepRow: React.FC<StepRowProps> = ({
  step,
  enabled,
  expanded,
  onToggleExpand,
  onStatusChange,
}) => {
  const [actionExpanded, setActionExpanded] = useState(false);
  const icon = getStatusIcon(step.status, enabled);
  const isInactive = step.status === 'not_applicable';

  const handlePress = () => {
    if (!enabled) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggleExpand(step.id);
  };

  const handleStatusSelect = (status: StepStatus) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onStatusChange(step.id, status);
    if (status === 'in_progress' && step.dontKnowAction) {
      setActionExpanded(true);
    }
  };

  return (
    <View
      style={[
        styles.row,
        !enabled && styles.rowDisabled,
        expanded && styles.rowExpanded,
        isInactive && styles.rowInactive,
      ]}
    >
      <TouchableOpacity
        style={styles.rowHeader}
        onPress={handlePress}
        activeOpacity={enabled ? 0.7 : 1}
        disabled={!enabled}
        accessibilityRole="button"
        accessibilityLabel={step.title}
        accessibilityState={{ expanded, disabled: !enabled }}
      >
        <Ionicons name={icon.name} size={22} color={icon.color} />
        <View style={styles.rowContent}>
          <Text
            style={[
              styles.rowTitle,
              !enabled && styles.rowTitleDisabled,
              isInactive && styles.rowTitleInactive,
            ]}
          >
            {step.title}
          </Text>
          <StepStatusBadge status={step.status} />
        </View>
        {enabled && (
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={Colors.textTertiary}
          />
        )}
      </TouchableOpacity>

      {expanded && enabled && (
        <View style={styles.expandPanel}>
          {step.helpText && (
            <Text style={styles.helpText}>{step.helpText}</Text>
          )}

          <View style={styles.statusOptions}>
            {STATUS_OPTIONS.map((option) => {
              const selected = step.status === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.statusPill, selected && styles.statusPillActive]}
                  onPress={() => handleStatusSelect(option.value)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      selected && styles.statusPillTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {step.status === 'in_progress' && step.dontKnowAction && (
            <DontKnowAction
              label={step.dontKnowAction.label}
              deepLink={step.dontKnowAction.deepLink}
              expanded={actionExpanded}
              onToggle={() => setActionExpanded((v) => !v)}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  rowExpanded: {
    borderColor: Colors.accentPrimary,
  },
  rowDisabled: {
    opacity: 0.5,
  },
  rowInactive: {
    opacity: 0.65,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  rowContent: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  rowTitleDisabled: {
    color: Colors.textTertiary,
  },
  rowTitleInactive: {
    textDecorationLine: 'line-through',
    color: Colors.textTertiary,
  },
  expandPanel: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  helpText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  statusPill: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.bgWhite,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusPillActive: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.accentPrimary,
  },
  statusPillText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  statusPillTextActive: {
    color: Colors.accentPrimary,
    fontWeight: FontWeight.semibold,
  },
});
