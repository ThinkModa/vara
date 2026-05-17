import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Spacing, FontWeight, Shadow, BorderRadius } from '../constants/spacing';

interface ImportFabPanelProps {
  open: boolean;
  onToggle: () => void;
  uploadCount: number;
  loading?: boolean;
  openLabel: string;
  closedLabel: string;
  children: React.ReactNode;
}

export function toggleImportPanelAnimation() {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}

export const ImportFabPanel: React.FC<ImportFabPanelProps> = ({
  open,
  onToggle,
  uploadCount,
  loading = false,
  openLabel,
  closedLabel,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const fabBottom = Math.max(insets.bottom, Spacing.sm) + Spacing.sm;

  return (
    <>
      {open && (
        <View style={[styles.panel, { bottom: fabBottom + 52 }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.panelScroll}
          >
            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator color={Colors.accentPrimary} />
              </View>
            ) : (
              children
            )}
          </ScrollView>
        </View>
      )}

      <TouchableOpacity
        style={[styles.fab, { bottom: fabBottom }]}
        onPress={onToggle}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={open ? openLabel : closedLabel}
      >
        <Ionicons name={open ? 'close' : 'add'} size={22} color={Colors.textWhite} />
        {!open && uploadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{uploadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
};

export function getImportFabScrollPadding(
  panelOpen: boolean,
  insetsBottom: number
): number {
  const fabBottom = Math.max(insetsBottom, Spacing.sm) + Spacing.sm;
  return fabBottom + 56 + (panelOpen ? 320 : 0);
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    maxHeight: '52%',
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.lg,
  },
  panelScroll: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  loading: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.accentTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.bgWhite,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textWhite,
  },
});
