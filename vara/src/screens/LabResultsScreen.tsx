import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '../constants/spacing';
import { labResults } from '../data/mockData';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const LabResultsScreen: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return { bg: Colors.phase4Bg, text: Colors.phase4Text, icon: 'checkmark-circle' as const };
      case 'high':
        return { bg: '#FEF2F2', text: Colors.error, icon: 'arrow-up-circle' as const };
      case 'low':
        return { bg: '#FEF9C3', text: '#92400E', icon: 'arrow-down-circle' as const };
      default:
        return { bg: Colors.divider, text: Colors.textSecondary, icon: 'help-circle' as const };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lab Results</Text>
          <Text style={styles.headerSubtitle}>
            Tap any result to see what it means for you
          </Text>
        </View>

        {/* Summary Banner */}
        <View style={styles.summaryBanner}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{labResults.filter(l => l.status === 'normal').length}</Text>
            <Text style={styles.summaryLabel}>Normal</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: Colors.warning }]}>
              {labResults.filter(l => l.status === 'low').length}
            </Text>
            <Text style={styles.summaryLabel}>Low</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: Colors.error }]}>
              {labResults.filter(l => l.status === 'high').length}
            </Text>
            <Text style={styles.summaryLabel}>High</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {labResults.map((lab) => {
            const status = getStatusColor(lab.status);
            const isExpanded = expandedId === lab.id;

            return (
              <TouchableOpacity
                key={lab.id}
                style={[styles.labCard, isExpanded && styles.labCardExpanded]}
                onPress={() => toggleExpand(lab.id)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`${lab.name}, ${lab.value} ${lab.unit}, ${lab.status}`}
              >
                <View style={styles.labHeader}>
                  <View style={styles.labHeaderLeft}>
                    <View style={[styles.statusDot, { backgroundColor: status.bg }]}>
                      <Ionicons name={status.icon} size={16} color={status.text} />
                    </View>
                    <View style={styles.labInfo}>
                      <Text style={styles.labName}>{lab.name}</Text>
                      <Text style={styles.labDate}>{lab.date}</Text>
                    </View>
                  </View>
                  <View style={styles.labHeaderRight}>
                    <Text style={styles.labValue}>
                      {lab.value} <Text style={styles.labUnit}>{lab.unit}</Text>
                    </Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={Colors.textTertiary}
                    />
                  </View>
                </View>

                {isExpanded && (
                  <View style={styles.labDetails}>
                    <View style={styles.rangeBar}>
                      <Text style={styles.rangeLabel}>Normal Range</Text>
                      <Text style={styles.rangeValue}>{lab.normalRange}</Text>
                    </View>

                    <View style={[styles.statusBanner, { backgroundColor: status.bg }]}>
                      <Ionicons name={status.icon} size={18} color={status.text} />
                      <Text style={[styles.statusBannerText, { color: status.text }]}>
                        {lab.status === 'normal' ? 'Within normal range' :
                         lab.status === 'high' ? 'Above normal range' : 'Below normal range'}
                      </Text>
                    </View>

                    <View style={styles.explanationBox}>
                      <Ionicons name="sparkles" size={16} color={Colors.accentSecondary} />
                      <Text style={styles.explanationTitle}>What this means</Text>
                    </View>
                    <Text style={styles.explanationText}>{lab.explanation}</Text>

                    <Text style={styles.disclaimer}>
                      This is informational only. Discuss your results with your doctor.
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </Animated.View>
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
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  summaryBanner: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.success,
  },
  summaryLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.divider,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  labCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  labCardExpanded: {
    borderColor: Colors.accentPrimary,
    ...Shadow.md,
  },
  labHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  labInfo: {
    flex: 1,
  },
  labName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  labDate: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  labHeaderRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  labValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  labUnit: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.textTertiary,
  },
  labDetails: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  rangeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  rangeLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  rangeValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  statusBannerText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  explanationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  explanationTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.accentSecondary,
  },
  explanationText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  disclaimer: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});
