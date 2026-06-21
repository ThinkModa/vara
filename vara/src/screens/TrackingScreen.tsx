import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '../constants/spacing';
import { MedicationCard } from '../components/MedicationCard';
import { cycleData } from '../data/mockData';
import { Medication, AppUser } from '../types/user';
import { FileUploadSection } from '../components/FileUploadSection';
import { DeviceInsightsSection } from '../components/DeviceInsightsSection';
import {
  getImportFabScrollPadding,
  ImportFabPanel,
  toggleImportPanelAnimation,
} from '../components/ImportFabPanel';
import { useFileUploads } from '../hooks/useFileUploads';
import { RoadmapPage } from '../components/roadmap/RoadmapPage';
import { createInitialPhases } from '../components/roadmap/roadmapData';
import { getProgress } from '../components/roadmap/roadmapLogic';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TrackingScreenProps {
  medications: Medication[];
  onToggleMedication: (index: number) => void;
  user: AppUser;
}

export const TrackingScreen: React.FC<TrackingScreenProps> = ({
  medications,
  onToggleMedication,
  user,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'overview' | 'meds' | 'roadmap'>('overview');
  const [roadmapProgress, setRoadmapProgress] = useState(() => {
    const phases = createInitialPhases();
    return getProgress(phases, {});
  });
  const [importPanelOpen, setImportPanelOpen] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    uploads: deviceUploads,
    loading: uploadsLoading,
    cloudStorageEnabled,
    addUpload,
    removeUpload,
  } = useFileUploads('device_tracking');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRoadmapProgressChange = useCallback((completed: number, total: number) => {
    setRoadmapProgress({ completed, total, remaining: total - completed, percent: total > 0 ? completed / total : 0 });
  }, []);

  const toggleImportPanel = () => {
    toggleImportPanelAnimation();
    setImportPanelOpen((open) => !open);
  };

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: 'grid-outline' as const },
    { key: 'meds' as const, label: 'Medications', icon: 'medkit-outline' as const },
    { key: 'roadmap' as const, label: 'Roadmap', icon: 'map-outline' as const },
  ];

  const headerSubtitle =
    activeTab === 'roadmap'
      ? `${roadmapProgress.completed} of ${roadmapProgress.total} questions addressed`
      : `Day ${cycleData.currentDay} of ${cycleData.totalDays}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cycle Tracking</Text>
          <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
          {activeTab === 'roadmap' && (
            <View style={styles.headerProgressBar}>
              <View
                style={[
                  styles.headerProgressFill,
                  { width: `${roadmapProgress.percent * 100}%` },
                ]}
              />
            </View>
          )}
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: activeTab === tab.key }}
            >
              <Ionicons
                name={tab.icon}
                size={18}
                color={activeTab === tab.key ? Colors.accentPrimary : Colors.textTertiary}
              />
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: getImportFabScrollPadding(importPanelOpen, insets.bottom) },
          ]}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <View>
              <DeviceInsightsSection uploads={deviceUploads} />

              {/* Follicle Visualization */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Follicle Sizes</Text>
                <Text style={styles.sectionDate}>Last updated today</Text>
              </View>

              <View style={styles.follicleContainer}>
                <View style={styles.ovarySection}>
                  <Text style={styles.ovaryLabel}>Left Ovary</Text>
                  <View style={styles.follicleRow}>
                    {cycleData.follicles.left.map((size, i) => (
                      <View key={i} style={styles.follicleItem}>
                        <View
                          style={[
                            styles.follicleCircle,
                            {
                              width: size * 2.5,
                              height: size * 2.5,
                              backgroundColor: size >= 14 ? Colors.phase2Bg : Colors.phase3Bg,
                              borderColor: size >= 14 ? Colors.phase2Text : Colors.phase3Text,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.follicleSize,
                              { color: size >= 14 ? Colors.phase2Text : Colors.phase3Text },
                            ]}
                          >
                            {size}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.ovaryDivider} />

                <View style={styles.ovarySection}>
                  <Text style={styles.ovaryLabel}>Right Ovary</Text>
                  <View style={styles.follicleRow}>
                    {cycleData.follicles.right.map((size, i) => (
                      <View key={i} style={styles.follicleItem}>
                        <View
                          style={[
                            styles.follicleCircle,
                            {
                              width: size * 2.5,
                              height: size * 2.5,
                              backgroundColor: size >= 14 ? Colors.phase2Bg : Colors.phase3Bg,
                              borderColor: size >= 14 ? Colors.phase2Text : Colors.phase3Text,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.follicleSize,
                              { color: size >= 14 ? Colors.phase2Text : Colors.phase3Text },
                            ]}
                          >
                            {size}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Hormone Levels */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Hormone Levels</Text>
              </View>
              {Object.entries(cycleData.hormones).map(([key, data]) => (
                <View key={key} style={styles.hormoneCard}>
                  <View style={styles.hormoneLeft}>
                    <Text style={styles.hormoneName}>{key.toUpperCase()}</Text>
                    <Text style={styles.hormoneUnit}>{data.unit}</Text>
                  </View>
                  <View style={styles.hormoneRight}>
                    <Text style={styles.hormoneValue}>{data.value}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        data.status === 'normal' && styles.statusNormal,
                        data.status === 'high' && styles.statusHigh,
                        data.status === 'low' && styles.statusLow,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          data.status === 'normal' && styles.statusTextNormal,
                          data.status === 'high' && styles.statusTextHigh,
                          data.status === 'low' && styles.statusTextLow,
                        ]}
                      >
                        {data.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Medications Tab */}
          {activeTab === 'meds' && (
            <View>
              <View style={styles.medProgress}>
                <LinearGradient
                  colors={[Colors.phase4Bg, '#ECFDF5']}
                  style={styles.medProgressCard}
                >
                  <Text style={styles.medProgressTitle}>
                    {medications.filter((m) => m.taken).length} of {medications.length} taken today
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(medications.filter((m) => m.taken).length / medications.length) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </LinearGradient>
              </View>

              {medications.map((med, index) => (
                <MedicationCard
                  key={index}
                  name={med.name}
                  time={med.time}
                  taken={med.taken}
                  onToggle={() => onToggleMedication(index)}
                />
              ))}

              <TouchableOpacity
                style={styles.addButton}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Add medication"
              >
                <Ionicons name="add" size={20} color={Colors.accentPrimary} />
                <Text style={styles.addButtonText}>Add Medication</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Roadmap Tab */}
          {activeTab === 'roadmap' && (
            <RoadmapPage userAge={user.age} onProgressChange={handleRoadmapProgressChange} />
          )}

        </ScrollView>

        <ImportFabPanel
          open={importPanelOpen}
          onToggle={toggleImportPanel}
          uploadCount={deviceUploads.length}
          loading={uploadsLoading}
          openLabel="Close device import"
          closedLabel="Import Inito or Kegg data"
        >
          <FileUploadSection
            variant="device_tracking"
            uploads={deviceUploads}
            cloudStorageEnabled={cloudStorageEnabled}
            onAddUpload={addUpload}
            onRemoveUpload={removeUpload}
          />
        </ImportFabPanel>
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
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  headerProgressBar: {
    height: 4,
    backgroundColor: Colors.divider,
    borderRadius: 2,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  headerProgressFill: {
    height: '100%',
    backgroundColor: Colors.accentPrimary,
    borderRadius: 2,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.bgWhite,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.accentPrimary,
  },
  tabText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
  },
  tabTextActive: {
    color: Colors.accentPrimary,
    fontWeight: FontWeight.semibold,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
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
  sectionDate: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  follicleContainer: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  ovarySection: {
    alignItems: 'center',
  },
  ovaryLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  follicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  follicleItem: {
    alignItems: 'center',
  },
  follicleCircle: {
    borderRadius: 9999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  follicleSize: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  ovaryDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  },
  hormoneCard: {
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
  hormoneLeft: {
    flex: 1,
  },
  hormoneName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  hormoneUnit: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  hormoneRight: {
    alignItems: 'flex-end',
  },
  hormoneValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 9999,
    marginTop: Spacing.xs,
  },
  statusNormal: {
    backgroundColor: Colors.phase4Bg,
  },
  statusHigh: {
    backgroundColor: '#FEF2F2',
  },
  statusLow: {
    backgroundColor: '#FEF9C3',
  },
  statusText: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
  },
  statusTextNormal: {
    color: Colors.phase4Text,
  },
  statusTextHigh: {
    color: Colors.error,
  },
  statusTextLow: {
    color: Colors.warning,
  },
  medProgress: {
    marginBottom: Spacing.md,
  },
  medProgressCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  medProgressTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.phase4Text,
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.accentPrimary,
    borderStyle: 'dashed',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  addButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.accentPrimary,
  },
});
