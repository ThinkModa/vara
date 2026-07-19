import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type {
  CycleProfile,
  DerivedCycleState,
  FlowIntensity,
  PeriodCycleSeed,
  PeriodDay,
  SymptomLog,
} from '../types/cycle';
import { periodCycleSeed } from '../data/mockData';
import {
  buildPeriodDaysForRange,
  deriveCycleState,
  getLatestPeriodStart,
  todayISO,
} from '../utils/cycleCalculations';

interface CycleContextValue {
  profile: CycleProfile;
  periodDays: PeriodDay[];
  symptomLogs: SymptomLog[];
  derived: DerivedCycleState;
  logPeriodStart: (dateISO?: string) => void;
  logPeriodEnd: (dateISO?: string) => void;
  setFlow: (dateISO: string, flow: FlowIntensity) => void;
  toggleSymptom: (dateISO: string, symptom: string) => void;
  updateProfile: (partial: Partial<CycleProfile>) => void;
  applySeed: (seed: PeriodCycleSeed) => void;
}

const CycleContext = createContext<CycleContextValue | null>(null);

interface CycleProviderProps {
  children: React.ReactNode;
  initialSeed?: PeriodCycleSeed;
}

export function CycleProvider({
  children,
  initialSeed = periodCycleSeed,
}: CycleProviderProps) {
  const [profile, setProfile] = useState<CycleProfile>(initialSeed.profile);
  const [periodDays, setPeriodDays] = useState<PeriodDay[]>(initialSeed.periodDays);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>(initialSeed.symptomLogs);

  const derived = useMemo(
    () => deriveCycleState(profile, periodDays),
    [profile, periodDays]
  );

  const applySeed = useCallback((seed: PeriodCycleSeed) => {
    setProfile(seed.profile);
    setPeriodDays(seed.periodDays);
    setSymptomLogs(seed.symptomLogs);
  }, []);

  const updateProfile = useCallback((partial: Partial<CycleProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  }, []);

  const setFlow = useCallback((dateISO: string, flow: FlowIntensity) => {
    setPeriodDays((prev) => {
      const existing = prev.find((d) => d.dateISO === dateISO);
      const next = existing
        ? prev.map((d) => (d.dateISO === dateISO ? { ...d, flow } : d))
        : [...prev, { dateISO, flow }].sort((a, b) => a.dateISO.localeCompare(b.dateISO));
      const latestStart = getLatestPeriodStart(next);
      if (latestStart) {
        setProfile((p) => ({ ...p, lastPeriodStartISO: latestStart }));
      }
      return next;
    });
  }, []);

  const logPeriodStart = useCallback((dateISO: string = todayISO()) => {
    setPeriodDays((prev) => {
      const withoutOverlap = prev.filter((d) => d.dateISO < dateISO);
      const newDays = buildPeriodDaysForRange(dateISO, 1, 'medium');
      return [...withoutOverlap, ...newDays].sort((a, b) =>
        a.dateISO.localeCompare(b.dateISO)
      );
    });
    setProfile((prev) => ({
      ...prev,
      lastPeriodStartISO: dateISO,
    }));
  }, []);

  const logPeriodEnd = useCallback((dateISO: string = todayISO()) => {
    setPeriodDays((prev) => {
      const start = getLatestPeriodStart(prev);
      if (!start) {
        return prev;
      }
      return prev.filter((d) => d.dateISO < start || d.dateISO <= dateISO);
    });
  }, []);

  const toggleSymptom = useCallback((dateISO: string, symptom: string) => {
    setSymptomLogs((prev) => {
      const existing = prev.find((log) => log.dateISO === dateISO);
      if (!existing) {
        return [...prev, { dateISO, symptoms: [symptom] }].sort((a, b) =>
          a.dateISO.localeCompare(b.dateISO)
        );
      }
      const has = existing.symptoms.includes(symptom);
      const symptoms = has
        ? existing.symptoms.filter((s) => s !== symptom)
        : [...existing.symptoms, symptom];
      if (symptoms.length === 0) {
        return prev.filter((log) => log.dateISO !== dateISO);
      }
      return prev.map((log) =>
        log.dateISO === dateISO ? { ...log, symptoms } : log
      );
    });
  }, []);

  const value = useMemo(
    () => ({
      profile,
      periodDays,
      symptomLogs,
      derived,
      logPeriodStart,
      logPeriodEnd,
      setFlow,
      toggleSymptom,
      updateProfile,
      applySeed,
    }),
    [
      profile,
      periodDays,
      symptomLogs,
      derived,
      logPeriodStart,
      logPeriodEnd,
      setFlow,
      toggleSymptom,
      updateProfile,
      applySeed,
    ]
  );

  return <CycleContext.Provider value={value}>{children}</CycleContext.Provider>;
}

export function useCycle(): CycleContextValue {
  const ctx = useContext(CycleContext);
  if (!ctx) {
    throw new Error('useCycle must be used within CycleProvider');
  }
  return ctx;
}
