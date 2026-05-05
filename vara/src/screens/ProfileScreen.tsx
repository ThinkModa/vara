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
import { AppUser } from '../types/user';

interface ProfileScreenProps {
  onLogout: () => void;
  user: AppUser;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout, user }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const profileFields = [
    { label: 'Age', value: `${user.age} years old`, icon: 'person-outline' as const },
    { label: 'Time Trying', value: user.timeTrying, icon: 'time-outline' as const },
    { label: 'Diagnosis', value: user.diagnosis, icon: 'medical-outline' as const },
    { label: 'Treatment Stage', value: user.treatmentStage, icon: 'flask-outline' as const },
    { label: 'Current Focus', value: user.focusGoal, icon: 'sparkles-outline' as const },
    { label: 'Clinic', value: user.clinic, icon: 'business-outline' as const },
    { label: 'Doctor', value: user.doctor, icon: 'people-outline' as const },
    { label: 'Partner', value: user.partner, icon: 'heart-outline' as const },
  ];

  const settingsItems = [
    { label: 'Notifications', icon: 'notifications-outline' as const, hasArrow: true },
    { label: 'Privacy & Security', icon: 'shield-outline' as const, hasArrow: true },
    { label: 'App Appearance', icon: 'color-palette-outline' as const, hasArrow: true },
    { label: 'Help & Support', icon: 'help-circle-outline' as const, hasArrow: true },
    { label: 'About', icon: 'information-circle-outline' as const, hasArrow: true },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={[Colors.gradientIndigo, Colors.accentTertiary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarInitial}>
                {user.name.charAt(0)}
              </Text>
            </LinearGradient>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>

            <View style={styles.treatmentBadge}>
              <Ionicons name="flask" size={14} color={Colors.phase2Text} />
              <Text style={styles.treatmentBadgeText}>{user.treatmentStage}</Text>
            </View>
          </View>

          {/* Journey Info */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Journey</Text>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Edit profile">
              <Ionicons name="create-outline" size={20} color={Colors.accentPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldsCard}>
            {profileFields.map((field, index) => (
              <View key={field.label}>
                <TouchableOpacity
                  style={styles.fieldRow}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`${field.label}: ${field.value}`}
                >
                  <View style={styles.fieldLeft}>
                    <View style={styles.fieldIcon}>
                      <Ionicons name={field.icon} size={18} color={Colors.accentPrimary} />
                    </View>
                    <View>
                      <Text style={styles.fieldLabel}>{field.label}</Text>
                      <Text style={styles.fieldValue}>{field.value}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
                </TouchableOpacity>
                {index < profileFields.length - 1 && <View style={styles.fieldDivider} />}
              </View>
            ))}
          </View>

          {/* Subscription */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Subscription</Text>
          </View>

          <TouchableOpacity style={styles.subscriptionCard} activeOpacity={0.85} accessibilityRole="button">
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.subscriptionGradient}
            >
              <View style={styles.subscriptionContent}>
                <View>
                  <Text style={styles.subscriptionTitle}>Free Plan</Text>
                  <Text style={styles.subscriptionDesc}>
                    Upgrade to Premium for AI insights, unlimited tracking, and more.
                  </Text>
                </View>
                <View style={styles.upgradeButton}>
                  <Text style={styles.upgradeText}>Upgrade</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Settings */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>

          <View style={styles.settingsCard}>
            {settingsItems.map((item, index) => (
              <View key={item.label}>
                <TouchableOpacity
                  style={styles.settingsRow}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <View style={styles.settingsLeft}>
                    <Ionicons name={item.icon} size={20} color={Colors.textSecondary} />
                    <Text style={styles.settingsLabel}>{item.label}</Text>
                  </View>
                  {item.hasArrow && (
                    <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
                  )}
                </TouchableOpacity>
                {index < settingsItems.length - 1 && <View style={styles.fieldDivider} />}
              </View>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={onLogout}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Log out"
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Version 1.0.0</Text>

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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarInitial: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textWhite,
  },
  profileName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  profileEmail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  treatmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.phase2Bg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 9999,
    marginTop: Spacing.sm,
    gap: 6,
  },
  treatmentBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.phase2Text,
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
  fieldsCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fieldIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  fieldLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
  },
  fieldValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: 60,
  },
  subscriptionCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.md,
  },
  subscriptionGradient: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  subscriptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.textWhite,
  },
  subscriptionDesc: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.xs,
    maxWidth: 200,
    lineHeight: 18,
  },
  upgradeButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  upgradeText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textWhite,
  },
  settingsCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingsLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: '#FEF2F2',
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
  },
  version: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  bottomSpacer: {
    height: Spacing['2xl'],
  },
});
