import React, { useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './src/screens/LoginScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { AppointmentsProvider } from './src/context/AppointmentsContext';
import { CycleProvider } from './src/context/CycleContext';
import { ensureSupabaseSession } from './src/lib/ensureSupabaseSession';
import { isSupabaseConfigured } from './src/lib/supabaseConfig';
import { currentUser, cycleData, periodCycleSeed } from './src/data/mockData';
import { AppUser, LoginPayload, Medication, OnboardingAnswers } from './src/types/user';
import type { PeriodCycleSeed } from './src/types/cycle';
import {
  buildSeedFromOnboarding,
  isNaturalTracking,
} from './src/utils/cycleCalculations';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [medications, setMedications] = useState<Medication[]>(cycleData.medications);
  const [cycleSeed, setCycleSeed] = useState<PeriodCycleSeed>(periodCycleSeed);
  const [user, setUser] = useState<AppUser>({
    ...currentUser,
    focusGoal: 'Medication reminders',
  });
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleLogin = (payload: LoginPayload) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setUser((prev) => ({
        ...prev,
        name: payload.isSignup ? payload.name || 'Vara' : payload.name || prev.name,
        email: payload.email || prev.email,
        ...(payload.isSignup ? { partner: 'John Smith' } : {}),
      }));
      setNeedsOnboarding(payload.isSignup);
      setIsLoggedIn(true);
      if (isSupabaseConfigured()) {
        void ensureSupabaseSession();
      }
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleOnboardingComplete = (answers: OnboardingAnswers) => {
    const treatmentStage = answers.treatmentStage ?? 'Tracking naturally';
    const natural = isNaturalTracking(treatmentStage, answers.mainGoal);
    setUser((prev) => ({
      ...prev,
      mainGoal: answers.mainGoal,
      timeTrying: answers.timeTrying ?? (answers.mainGoal === 'Tracking my period' ? 'Not trying' : 'N/A'),
      treatmentStage,
      focusGoal: answers.focusGoal,
      diagnosis: natural ? (answers.mainGoal === 'Other' ? 'Exploring' : 'Tracking naturally') : prev.diagnosis,
    }));
    if (natural) {
      setCycleSeed(buildSeedFromOnboarding(answers));
    } else {
      setCycleSeed(periodCycleSeed);
    }
    setNeedsOnboarding(false);
  };

  const handleToggleMedication = (index: number) => {
    setMedications((prev) =>
      prev.map((med, medIndex) =>
        medIndex === index ? { ...med, taken: !med.taken } : med
      )
    );
  };

  const handleLogout = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsLoggedIn(false);
      setCycleSeed(periodCycleSeed);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {isLoggedIn ? (
          needsOnboarding ? (
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          ) : (
            <AppointmentsProvider>
              <CycleProvider key={`${cycleSeed.profile.lastPeriodStartISO}-${cycleSeed.profile.averageCycleLength}`} initialSeed={cycleSeed}>
                <NavigationContainer>
                  <AppNavigator
                    onLogout={handleLogout}
                    user={user}
                    medications={medications}
                    onToggleMedication={handleToggleMedication}
                  />
                </NavigationContainer>
              </CycleProvider>
            </AppointmentsProvider>
          )
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
      </Animated.View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
