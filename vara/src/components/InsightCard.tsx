import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '../constants/spacing';

type InsightColor = 'purple' | 'pink' | 'blue' | 'green';

interface InsightCardProps {
  icon: string;
  title: string;
  body: string;
  color: InsightColor;
  onPress?: () => void;
}

const colorMap: Record<InsightColor, { gradient: [string, string]; iconBg: string; iconColor: string }> = {
  purple: {
    gradient: ['#EDE9FE', '#F5F3FF'],
    iconBg: Colors.phase2Bg,
    iconColor: Colors.phase2Text,
  },
  pink: {
    gradient: ['#FDE8EF', '#FFF1F2'],
    iconBg: Colors.phase1Bg,
    iconColor: Colors.phase1Text,
  },
  blue: {
    gradient: ['#DBEAFE', '#EFF6FF'],
    iconBg: Colors.phase3Bg,
    iconColor: Colors.phase3Text,
  },
  green: {
    gradient: ['#D1FAE5', '#ECFDF5'],
    iconBg: Colors.phase4Bg,
    iconColor: Colors.phase4Text,
  },
};

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  sparkles: 'sparkles',
  heart: 'heart-outline',
  clipboard: 'clipboard-outline',
  calendar: 'calendar-outline',
  flask: 'flask-outline',
  'trending-up': 'trending-up',
};

export const InsightCard: React.FC<InsightCardProps> = ({ icon, title, body, color, onPress }) => {
  const theme = colorMap[color];

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} accessibilityRole="button" accessibilityLabel={title}>
      <LinearGradient
        colors={theme.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
          <Ionicons
            name={iconMap[icon] || 'information-circle-outline'}
            size={20}
            color={theme.iconColor}
          />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  body: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
