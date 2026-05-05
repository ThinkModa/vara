import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '../constants/spacing';
import { InsightCard } from '../components/InsightCard';
import { dashboardInsights, doctorQuestions, educationTopics } from '../data/mockData';

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  calendar: 'calendar-outline',
  flask: 'flask-outline',
  'trending-up': 'trending-up',
  heart: 'heart-outline',
};

export const InsightsScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Insights</Text>
          <Text style={styles.headerSubtitle}>Personalized guidance for your journey</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* AI Insights */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="sparkles" size={18} color={Colors.accentSecondary} />
              <Text style={styles.sectionTitle}>AI Insights</Text>
            </View>
          </View>

          {dashboardInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              icon={insight.icon}
              title={insight.title}
              body={insight.body}
              color={insight.color}
            />
          ))}

          {/* Doctor Questions */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.accentPrimary} />
              <Text style={styles.sectionTitle}>Questions for Your Doctor</Text>
            </View>
          </View>

          <View style={styles.questionsCard}>
            <LinearGradient
              colors={['#F5F3FF', '#EEF2FF']}
              style={styles.questionsGradient}
            >
              <Text style={styles.questionsIntro}>
                Based on your current cycle data, here are some questions to ask at your next appointment:
              </Text>
              {doctorQuestions.map((question, index) => (
                <View key={index} style={styles.questionRow}>
                  <View style={styles.questionNumber}>
                    <Text style={styles.questionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.questionText}>{question}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.copyButton}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Copy all questions"
              >
                <Ionicons name="copy-outline" size={16} color={Colors.accentPrimary} />
                <Text style={styles.copyButtonText}>Copy All Questions</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Education */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="book-outline" size={18} color={Colors.phase4Text} />
              <Text style={styles.sectionTitle}>Learn More</Text>
            </View>
          </View>

          {educationTopics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.educationCard}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`${topic.title}, ${topic.readTime} read`}
            >
              <View style={styles.educationLeft}>
                <View style={styles.educationIcon}>
                  <Ionicons
                    name={iconMap[topic.icon] || 'book-outline'}
                    size={20}
                    color={Colors.accentPrimary}
                  />
                </View>
                <View style={styles.educationInfo}>
                  <Text style={styles.educationTitle}>{topic.title}</Text>
                  <View style={styles.educationMeta}>
                    <Text style={styles.educationCategory}>{topic.category}</Text>
                    <View style={styles.metaDot} />
                    <Text style={styles.educationTime}>{topic.readTime}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}

          {/* Disclaimer */}
          <View style={styles.disclaimerCard}>
            <Ionicons name="information-circle-outline" size={18} color={Colors.textTertiary} />
            <Text style={styles.disclaimerText}>
              AI-generated insights are for informational purposes only. Always consult your healthcare provider for medical decisions.
            </Text>
          </View>

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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  questionsCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  questionsGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  questionsIntro: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  questionNumber: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    backgroundColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumberText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.textWhite,
  },
  questionText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(99,102,241,0.1)',
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  copyButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.accentPrimary,
  },
  educationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  educationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  educationIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  educationInfo: {
    flex: 1,
  },
  educationTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  educationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  educationCategory: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 9999,
    backgroundColor: Colors.textTertiary,
    marginHorizontal: Spacing.sm,
  },
  educationTime: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.divider,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  disclaimerText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});
