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
import { CycleRing } from '../components/CycleRing';
import { InsightCard } from '../components/InsightCard';
import { currentUser, cycleData, dashboardInsights } from '../data/mockData';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{currentUser.name}</Text>
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
            {/* Cycle Ring Hero */}
            <View style={styles.ringSection}>
              <CycleRing
                currentDay={cycleData.currentDay}
                totalDays={cycleData.totalDays}
                phase={cycleData.phase}
              />
            </View>

            {/* Next Appointment */}
            <TouchableOpacity
              style={styles.appointmentCard}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`Next appointment ${cycleData.nextAppointment}`}
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
                    <View>
                      <Text style={styles.appointmentLabel}>Next Appointment</Text>
                      <Text style={styles.appointmentDate}>{cycleData.nextAppointment}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Quick Stats */}
            <View style={styles.statsRow}>
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
                  {cycleData.medications.filter(m => m.taken).length}/{cycleData.medications.length}
                </Text>
                <Text style={styles.statLabel}>Meds Today</Text>
              </View>
            </View>

            {/* Medications Quick View */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Medications</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Tracking')}
                accessibilityRole="button"
                accessibilityLabel="See all medications"
              >
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {cycleData.medications.map((med, index) => (
              <View key={index} style={styles.medRow}>
                <View style={styles.medLeft}>
                  <Ionicons
                    name={med.taken ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={med.taken ? Colors.success : Colors.textTertiary}
                  />
                  <Text style={[styles.medName, med.taken && styles.medTaken]}>{med.name}</Text>
                </View>
                <Text style={styles.medTime}>{med.time}</Text>
              </View>
            ))}

            {/* AI Insights */}
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
            {dashboardInsights.map((insight) => (
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
  appointmentDate: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textWhite,
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
