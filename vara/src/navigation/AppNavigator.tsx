import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/spacing';
import { DashboardScreen } from '../screens/DashboardScreen';
import { TrackingScreen } from '../screens/TrackingScreen';
import { LabResultsScreen } from '../screens/LabResultsScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AppUser, Medication } from '../types/user';

const Tab = createBottomTabNavigator();

interface AppNavigatorProps {
  onLogout: () => void;
  user: AppUser;
  medications: Medication[];
  onToggleMedication: (index: number) => void;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({
  onLogout,
  user,
  medications,
  onToggleMedication,
}) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Tracking':
              iconName = focused ? 'pulse' : 'pulse-outline';
              break;
            case 'Labs':
              iconName = focused ? 'flask' : 'flask-outline';
              break;
            case 'Insights':
              iconName = focused ? 'sparkles' : 'sparkles-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: Colors.accentPrimary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.bgWhite,
          borderTopWidth: 1,
          borderTopColor: Colors.divider,
          height: 80,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: FontWeight.medium,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        children={({ navigation }) => (
          <DashboardScreen
            navigation={navigation}
            user={user}
            medications={medications}
            onToggleMedication={onToggleMedication}
          />
        )}
      />
      <Tab.Screen
        name="Tracking"
        children={() => (
          <TrackingScreen
            medications={medications}
            onToggleMedication={onToggleMedication}
          />
        )}
      />
      <Tab.Screen name="Labs" component={LabResultsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen
        name="Profile"
        children={() => <ProfileScreen onLogout={onLogout} user={user} />}
      />
    </Tab.Navigator>
  );
};
