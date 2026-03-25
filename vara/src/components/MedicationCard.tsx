import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '../constants/spacing';

interface MedicationCardProps {
  name: string;
  time: string;
  taken: boolean;
  onToggle?: () => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({ name, time, taken, onToggle }) => {
  return (
    <TouchableOpacity
      style={[styles.card, taken && styles.cardTaken]}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${name} at ${time}, ${taken ? 'taken' : 'not taken'}`}
    >
      <View style={styles.leftContent}>
        <View style={[styles.checkbox, taken && styles.checkboxChecked]}>
          {taken && <Ionicons name="checkmark" size={14} color={Colors.textWhite} />}
        </View>
        <View style={styles.textContent}>
          <Text style={[styles.name, taken && styles.nameTaken]}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
      <Ionicons
        name={taken ? 'checkmark-circle' : 'ellipse-outline'}
        size={24}
        color={taken ? Colors.success : Colors.textTertiary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTaken: {
    backgroundColor: Colors.phase4Bg,
    borderColor: 'transparent',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  textContent: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  nameTaken: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  time: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
