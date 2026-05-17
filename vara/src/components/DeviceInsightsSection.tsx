import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InsightCard } from './InsightCard';
import { Colors } from '../constants/colors';
import { Spacing, FontSize, FontWeight } from '../constants/spacing';
import type { LabUpload } from '../types/labUpload';
import { getDeviceInsights } from '../utils/deviceInsights';

interface DeviceInsightsSectionProps {
  uploads: LabUpload[];
}

export const DeviceInsightsSection: React.FC<DeviceInsightsSectionProps> = ({ uploads }) => {
  const insights = useMemo(() => getDeviceInsights(uploads), [uploads]);
  const hasSavedUpload = uploads.some((u) => u.status === 'saved');

  if (!hasSavedUpload) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Insights from your uploads</Text>
      <Text style={styles.sectionSubtitle}>
        Based on your Inito and Kegg charts. Informational only—not medical advice.
      </Text>
      {insights.map((insight) => (
        <View key={insight.id} style={styles.cardWrap}>
          <InsightCard
            icon={insight.icon}
            title={insight.title}
            body={insight.body}
            color={insight.color}
          />
          <Text style={styles.sourceTag}>From {insight.sourceLabel}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  cardWrap: {
    marginBottom: Spacing.sm,
  },
  sourceTag: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
