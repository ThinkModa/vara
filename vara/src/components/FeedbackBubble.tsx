import React from 'react';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '../constants/spacing';
import { FEEDBACK_FORM_URL } from '../constants/links';

const TAB_BAR_HEIGHT = 80;

export function FeedbackBubble() {
  if (Platform.OS !== 'web') {
    return null;
  }

  const handlePress = () => {
    void Linking.openURL(FEEDBACK_FORM_URL);
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.bubble}
        onPress={handlePress}
        activeOpacity={0.85}
        accessibilityRole="link"
        accessibilityLabel="Share feedback about the Vara prototype"
        accessibilityHint="Opens the feedback form in a new tab"
      >
        <LinearGradient
          colors={[Colors.gradientIndigo, Colors.gradientPurple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.textWhite} />
          <Text style={styles.label}>Share feedback</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: TAB_BAR_HEIGHT + Spacing.sm,
    alignItems: 'center',
    zIndex: 1000,
  },
  bubble: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...Shadow.lg,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  label: {
    color: Colors.textWhite,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
});
