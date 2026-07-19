import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '../constants/spacing';
import { CycleRing } from '../components/CycleRing';
import { InsightCard } from '../components/InsightCard';
import { cycleData, dashboardInsights, naturalDashboardInsights } from '../data/mockData';
import { useAppointments } from '../context/AppointmentsContext';
import { useCycle } from '../context/CycleContext';
import { formatAppointmentDisplayDate, getNextAppointment } from '../utils/appointments';
import { isNaturalTracking } from '../utils/cycleCalculations';
import { AppUser, Medication } from '../types/user';

const screenWidth = Dimensions.get('window').width;

interface DashboardScreenProps {
  navigation: any;
  user: AppUser;
  medications: Medication[];
  onToggleMedication: (index: number) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
  user,
  medications,
  onToggleMedication,
}) => {
  const { appointments } = useAppointments();
  const { derived, profile } = useCycle();
  const natural = isNaturalTracking(user.treatmentStage, user.mainGoal);
  const nextVisit = getNextAppointment(appointments);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const insights = natural ? naturalDashboardInsights : dashboardInsights;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const goToTracking = (tab: 'cycle' | 'symptoms' | 'overview' | 'meds') => {
    navigation.navigate('Tracking', { tab });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.focusGoal}>
              {user.mainGoal ? `${user.mainGoal} · ` : ''}Focus: {user.focusGoal}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <View style={styles.ringSection}>
              <CycleRing
                currentDay={natural ? derived.currentDay : cycleData.currentDay}
                totalDays={natural ? derived.totalDays : cycleData.totalDays}
                phase={natural ? derived.phase : cycleData.phase}
              />
              {natural && (
                <Text style={styles.ringCaption}>
                  {derived.daysUntilNextPeriod === 0
                    ? 'Period may start today'
                    : `Period expected in ${derived.daysUntilNextPeriod} days`}
                </Text>
              )}
            </View>

            {natural && (
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={[styles.quickAction, { backgroundColor: Colors.phase1Bg }]}
                  onPress={() => goToTracking('cycle')}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Log period"
                >
                  <Ionicons name="water" size={20} color={Colors.phase1Text} />
                  <Text style={[styles.quickActionText, { color: Colors.phase1Text }]}>
                    Log period
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.quickAction, { backgroundColor: Colors.phase2Bg }]}
                  onPress={() => goToTracking('symptoms')}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Log symptoms"
                >
                  <Ionicons name="heart" size={20} color={Colors.phase2Text} />
                  <Text style={[styles.quickActionText, { color: Colors.phase2Text }]}>
                    Log symptoms
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.appointmentCard}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={
                nextVisit
                  ? `Next appointment ${formatAppointmentDisplayDate(nextVisit.dateISO)}`
                  : 'View appointments'
              }
              onPress={() => navigation.navigate('Appointments' as never)}
            >
              <LinearGradient
                colors={[Colors.gradientIndigo, Colors.accentSecondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.appointmentGradient}
              >
                <View style={styles.appointmentContent}>
                  <View style={styles.appointmentLeft}>
                    <View style={styles.appointmentIconBg}>
                      <Ionicons name="calendar" size={20} color={Colors.accentPrimary} />
                    </View>
                    <View style={styles.appointmentTextCol}>
                      <Text style={styles.appointmentLabel}>Next Appointment</Text>
                      {nextVisit ? (
                        <>
                          <Text style={styles.appointmentDate}>
                            {formatAppointmentDisplayDate(nextVisit.dateISO)}
                          </Text>
                          <Text style={styles.appointmentSub} numberOfLines={1}>
                            {nextVisit.timeLabel} · {nextVisit.title}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text style={styles.appointmentDate}>Nothing scheduled</Text>
                          <Text style={styles.appointmentSub} numberOfLines={1}>
                            Tap to add visits & reminders
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.statsRow}>
              {natural ? (
                <>
                  <View style={[styles.statCard, { backgroundColor: Colors.phase1Bg }]}>
                    <Text style={[styles.statValue, { color: Colors.phase1Text }]}>
                      {derived.daysUntilNextPeriod}d
                    </Text>
                    <Text style={styles.statLabel}>Until Period</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: Colors.phase2Bg }]}>
                    <Text style={[styles.statValue, { color: Colors.phase2Text }]}>
                      {profile.averageCycleLength}d
                    </Text>
                    <Text style={styles.statLabel}>Avg Cycle</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: Colors.phase3Bg }]}>
                    <Text style={[styles.statValue, { color: Colors.phase3Text }]}>
                      {profile.averagePeriodLength}d
                    </Text>
                    <Text style={styles.statLabel}>Avg Period</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={[styles.statCard, { backgroundColor: Colors.phase1Bg }]}>
                    <Text style={[styles.statValue, { color: Colors.phase1Text }]}>
                      {cycleData.follicles.leadFollicle}mm
                    </Text>
                    <Text style={styles.statLabel}>Lead Follicle</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: Colors.phase2Bg }]}>
                    <Text style={[styles.statValue, { color: Colors.phase2Text }]}>
                      {cycleData.hormones.estradiol.value}
                    </Text>
                    <Text style={styles.statLabel}>Estradiol</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: Colors.phase3Bg }]}>
                    <Text style={[styles.statValue, { color: Colors.phase3Text }]}>
                      {medications.filter((m) => m.taken).length}/{medications.length}
                    </Text>
                    <Text style={styles.statLabel}>Meds Today</Text>
                  </View>
                </>
              )}
            </View>

            {!natural && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Today's Medications</Text>
                  <TouchableOpacity
                    onPress={() => goToTracking('meds')}
                    accessibilityRole="button"
                    accessibilityLabel="See all medications"
                  >
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                </View>
                {medications.map((med, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.medRow}
                    onPress={() => onToggleMedication(index)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={`${med.name} at ${med.time}, ${med.taken ? 'taken' : 'not taken'}`}
                  >
                    <View style={styles.medLeft}>
                      <Ionicons
                        name={med.taken ? 'checkmark-circle' : 'ellipse-outline'}
                        size={20}
                        color={med.taken ? Colors.success : Colors.textTertiary}
                      />
                      <Text style={[styles.medName, med.taken && styles.medTaken]}>
                        {med.name}
                      </Text>
                    </View>
                    <Text style={styles.medTime}>{med.time}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {natural && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Your Cycle</Text>
                  <TouchableOpacity
                    onPress={() => goToTracking('cycle')}
                    accessibilityRole="button"
                    accessibilityLabel="Open cycle tracking"
                  >
                    <Text style={styles.seeAll}>Track</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.cycleSummaryCard}>
                  <Text style={styles.cycleSummaryTitle}>{derived.phase} phase</Text>
                  <Text style={styles.cycleSummaryBody}>
                    You are on day {derived.currentDay} of your {derived.totalDays}-day cycle.
                    {profile.regularity === 'irregular'
                      ? ' Your cycles are marked irregular — predictions are a gentle guide.'
                      : ' Keep logging to refine your predictions.'}
                  </Text>
                </View>
              </>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Insights</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Insights')}
                accessibilityRole="button"
                accessibilityLabel="See all insights"
              >
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {insights.map((insight) => (
              <InsightCard
                key={insight.id}
                icon={insight.icon}
                title={insight.title}
                body={insight.body}
                color={insight.color}
                onPress={() => navigation.navigate('Insights')}
              />
            ))}

            <View style={styles.bottomSpacer} />
          </Animated.View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  greeting: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  focusGoal: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: Colors.bgWhite,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentTertiary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  ringSection: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  ringCaption: {
    marginTop: Spacing.md,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    minHeight: 48,
  },
  quickActionText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  appointmentCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  appointmentGradient: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  appointmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appointmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentIconBg: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  appointmentLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: 'rgba(255,255,255,0.8)',
  },
  appointmentTextCol: {
    flex: 1,
    maxWidth: screenWidth - 140,
  },
  appointmentDate: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textWhite,
  },
  appointmentSub: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  seeAll: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.accentPrimary,
  },
  cycleSummaryCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cycleSummaryTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  cycleSummaryBody: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  medRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  medLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  medTaken: {
    textDecorationLine: 'line-through',
    color: Colors.textTertiary,
  },
  medTime: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.textTertiary,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});
