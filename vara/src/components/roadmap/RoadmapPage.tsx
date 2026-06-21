import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/spacing';
import type { RoadmapIntakeAnswers, StepStatus } from '../../types/roadmap';
import { createInitialPhases, ROADMAP_DISCLAIMER } from './roadmapData';
import {
  applyIntakeAnswers,
  applyStatusesToPhases,
  getAgeFlagMessages,
  getCurrentPhase,
  getProgress,
  type StepStatusMap,
} from './roadmapLogic';
import { PhaseSection } from './PhaseSection';
import { RoadmapIntakeModal } from './RoadmapIntakeModal';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const STORAGE_KEY = 'vara_roadmap_statuses';
const INTAKE_KEY = 'vara_roadmap_intake_complete';

interface RoadmapPageProps {
  userAge: number;
  onProgressChange?: (completed: number, total: number) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ userAge, onProgressChange }) => {
  const [statuses, setStatuses] = useState<StepStatusMap>({});
  const [loaded, setLoaded] = useState(false);
  const [showIntake, setShowIntake] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([1]);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [intakeAge, setIntakeAge] = useState(userAge);

  const phases = applyStatusesToPhases(createInitialPhases(), statuses);
  const progress = getProgress(phases, statuses);
  const currentPhase = getCurrentPhase(phases, statuses);
  const ageFlags = getAgeFlagMessages(phases, intakeAge);

  useEffect(() => {
    onProgressChange?.(progress.completed, progress.total);
  }, [progress.completed, progress.total, onProgressChange]);

  useEffect(() => {
    void loadState();
  }, []);

  const loadState = async () => {
    try {
      const [storedStatuses, intakeComplete] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(INTAKE_KEY),
      ]);

      if (storedStatuses) {
        setStatuses(JSON.parse(storedStatuses) as StepStatusMap);
      }

      if (!intakeComplete) {
        setShowIntake(true);
      }
    } catch {
      setShowIntake(true);
    } finally {
      setLoaded(true);
    }
  };

  const persistStatuses = useCallback(async (next: StepStatusMap) => {
    setStatuses(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // local-only fallback
    }
  }, []);

  const handleIntakeComplete = async (answers: RoadmapIntakeAnswers) => {
    const initial = applyIntakeAnswers(answers);
    setIntakeAge(answers.age);
    await persistStatuses(initial);
    setShowIntake(false);

    const updatedPhases = applyStatusesToPhases(createInitialPhases(), initial);
    const phase = getCurrentPhase(updatedPhases, initial);
    setExpandedPhases([phase.number]);

    try {
      await AsyncStorage.setItem(INTAKE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const handleStatusChange = (stepId: string, status: StepStatus) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = { ...statuses, [stepId]: status };
    void persistStatuses(next);
  };

  const handleTogglePhase = (phaseNumber: number) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseNumber)
        ? prev.filter((n) => n !== phaseNumber)
        : [...prev, phaseNumber]
    );
  };

  const handleToggleStep = (stepId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedStepId((prev) => (prev === stepId ? null : stepId));
  };

  if (!loaded) {
    return null;
  }

  return (
    <View>
      <RoadmapIntakeModal
        visible={showIntake}
        defaultAge={userAge}
        onComplete={handleIntakeComplete}
      />

      {/* Progress card */}
      <View style={styles.progressSection}>
        <LinearGradient colors={[Colors.phase2Bg, '#F5F3FF']} style={styles.progressCard}>
          <Text style={styles.progressTitle}>
            {progress.completed} of {progress.total} questions addressed
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress.percent * 100}%` }]} />
          </View>
        </LinearGradient>
      </View>

      {/* Age flag banners */}
      {ageFlags.map((message) => (
        <View key={message} style={styles.ageBanner}>
          <Ionicons name="information-circle" size={18} color={Colors.warning} />
          <Text style={styles.ageBannerText}>{message}</Text>
        </View>
      ))}

      {/* Phase sections */}
      {phases.map((phase) => (
        <PhaseSection
          key={phase.number}
          phase={phase}
          statuses={statuses}
          expanded={expandedPhases.includes(phase.number)}
          expandedStepId={expandedStepId}
          onTogglePhase={handleTogglePhase}
          onToggleStep={handleToggleStep}
          onStatusChange={handleStatusChange}
        />
      ))}

      {/* Bottom summary */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          {progress.remaining > 0
            ? `Currently on: ${currentPhase.title} · ${progress.remaining} questions remaining`
            : `All questions addressed — discuss next steps with your doctor`}
        </Text>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Ionicons name="medical-outline" size={16} color={Colors.textTertiary} />
        <Text style={styles.disclaimerText}>{ROADMAP_DISCLAIMER}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressSection: {
    marginBottom: Spacing.md,
  },
  progressCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  progressTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.phase2Text,
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
    backgroundColor: Colors.accentPrimary,
    borderRadius: 4,
  },
  ageBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: '#FFFBEB',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ageBannerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: '#92400E',
    lineHeight: 20,
  },
  summaryBar: {
    marginTop: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.phase2Bg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.phase2Text,
    textAlign: 'center',
    lineHeight: 20,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xs,
  },
  disclaimerText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    lineHeight: 16,
  },
});
