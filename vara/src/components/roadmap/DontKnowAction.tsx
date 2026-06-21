import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight, BorderRadius, Spacing } from '../../constants/spacing';
import { DEEP_LINK_CONTENT } from './roadmapData';

interface DontKnowActionProps {
  label: string;
  deepLink?: string;
  expanded: boolean;
  onToggle: () => void;
}

export const DontKnowAction: React.FC<DontKnowActionProps> = ({
  label,
  deepLink,
  expanded,
  onToggle,
}) => {
  const content = deepLink ? DEEP_LINK_CONTENT[deepLink] : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.linkRow}
        onPress={onToggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Ionicons name="arrow-forward-circle" size={16} color={Colors.accentPrimary} />
        <Text style={styles.linkText}>{label}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={Colors.accentPrimary}
        />
      </TouchableOpacity>

      {expanded && content && (
        <View style={styles.contentBox}>
          <Text style={styles.contentTitle}>{content.title}</Text>
          <Text style={styles.contentBody}>{content.body}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.xs,
  },
  linkText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.accentPrimary,
  },
  contentBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contentTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  contentBody: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
