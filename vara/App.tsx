import React, { useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './src/screens/LoginScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { AppointmentsProvider } from './src/context/AppointmentsContext';
import { currentUser, cycleData } from './src/data/mockData';
import { AppUser, LoginPayload, Medication, OnboardingAnswers } from './src/types/user';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [medications, setMedications] = useState<Medication[]>(cycleData.medications);
  const [user, setUser] = useState<AppUser>({
    ...currentUser,
    focusGoal: 'Medication reminders',
  });
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleLogin = (payload: LoginPayload) => {
    // Fade out login, fade in main app
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setUser((prev) => ({
        ...prev,
        name: payload.name || prev.name,
        email: payload.email || prev.email,
      }));
      // Onboarding only for new accounts — returning users (Log in) go straight to the app.
      setNeedsOnboarding(payload.isSignup);
      setIsLoggedIn(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleOnboardingComplete = (answers: OnboardingAnswers) => {
    setUser((prev) => ({
      ...prev,
      timeTrying: answers.timeTrying,
      treatmentStage: answers.treatmentStage,
      focusGoal: answers.focusGoal,
    }));
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
              <NavigationContainer>
                <AppNavigator
                  onLogout={handleLogout}
                  user={user}
                  medications={medications}
                  onToggleMedication={handleToggleMedication}
                />
              </NavigationContainer>
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
