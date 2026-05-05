import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight, Spacing } from '../constants/spacing';

interface CycleRingProps {
  currentDay: number;
  totalDays: number;
  phase: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CycleRing: React.FC<CycleRingProps> = ({ currentDay, totalDays, phase }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const size = 220;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = currentDay / totalDays;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <SvgGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={Colors.gradientIndigo} />
            <Stop offset="100%" stopColor={Colors.accentTertiary} />
          </SvgGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.divider}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.centerContent}>
        <Text style={styles.dayLabel}>Day</Text>
        <Text style={styles.dayNumber}>{currentDay}</Text>
        <View style={styles.phaseBadge}>
          <Text style={styles.phaseText}>{phase}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 220,
    height: 220,
    alignSelf: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dayNumber: {
    fontSize: 56,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    lineHeight: 64,
  },
  phaseBadge: {
    backgroundColor: Colors.phase2Bg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 9999,
    marginTop: Spacing.xs,
  },
  phaseText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.phase2Text,
  },
});
