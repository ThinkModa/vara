import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '../constants/spacing';
import type { Appointment, AppointmentType } from '../types/user';
import {
  formatAppointmentDisplayDate,
  partitionAppointments,
} from '../utils/appointments';

const APPOINTMENT_TYPES: AppointmentType[] = [
  'Ultrasound',
  'Blood draw',
  'Consult',
  'Procedure',
  'Other',
];

interface AppointmentsScreenProps {
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdateAppointment: (id: string, patch: Partial<Omit<Appointment, 'id'>>) => void;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({
  appointments,
  onAddAppointment,
  onUpdateAppointment,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [dateISO, setDateISO] = useState('');
  const [timeLabel, setTimeLabel] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<AppointmentType>('Consult');
  const [notes, setNotes] = useState('');

  const editingAppointment = useMemo(
    () => (editingId ? appointments.find((a) => a.id === editingId) : undefined),
    [appointments, editingId]
  );

  const { upcoming, past, cancelled } = useMemo(
    () => partitionAppointments(appointments),
    [appointments]
  );

  const canSave =
    title.trim().length > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(dateISO.trim()) &&
    timeLabel.trim().length > 0 &&
    location.trim().length > 0;

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDateISO('');
    setTimeLabel('');
    setLocation('');
    setType('Consult');
    setNotes('');
  };

  const closeModal = () => {
    resetForm();
    setModalVisible(false);
  };

  const openNew = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEdit = (item: Appointment) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDateISO(item.dateISO);
    setTimeLabel(item.timeLabel);
    setLocation(item.location);
    setType(item.type);
    setNotes(item.notes ?? '');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!canSave) return;
    const payload: Omit<Appointment, 'id'> = {
      title: title.trim(),
      dateISO: dateISO.trim(),
      timeLabel: timeLabel.trim(),
      location: location.trim(),
      type,
      notes: notes.trim() || undefined,
      status: editingAppointment?.status === 'cancelled' ? 'cancelled' : 'scheduled',
    };

    if (editingId) {
      onUpdateAppointment(editingId, payload);
    } else {
      onAddAppointment({ ...payload, status: 'scheduled' });
    }
    closeModal();
  };

  const handleCancelVisit = () => {
    if (!editingId) return;
    Alert.alert(
      'Cancel this visit?',
      'It will move to Cancelled. You can edit and restore it anytime.',
      [
        { text: 'Keep appointment', style: 'cancel' },
        {
          text: 'Cancel visit',
          style: 'destructive',
          onPress: () => {
            onUpdateAppointment(editingId, { status: 'cancelled' });
            closeModal();
          },
        },
      ]
    );
  };

  const handleRestoreVisit = () => {
    if (!editingId) return;
    onUpdateAppointment(editingId, { status: 'scheduled' });
    closeModal();
  };

  const renderCard = (item: Appointment) => {
    const isCancelled = item.status === 'cancelled';
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.card, isCancelled && styles.cardCancelled]}
        onPress={() => openEdit(item)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={
          isCancelled
            ? `Cancelled: ${item.title}, tap to edit or restore`
            : `${item.title}, tap to edit`
        }
      >
        <View style={styles.cardTop}>
          <View style={styles.cardRowTitle}>
            <View style={[styles.typePill, isCancelled && styles.typePillCancelled]}>
              <Text style={[styles.typePillText, isCancelled && styles.typePillTextCancelled]}>
                {isCancelled ? 'Cancelled' : item.type}
              </Text>
            </View>
            {!isCancelled ? (
              <View style={styles.editHint}>
                <Text style={styles.editHintText}>Edit</Text>
                <Ionicons name="create-outline" size={16} color={Colors.accentPrimary} />
              </View>
            ) : null}
          </View>
          <Text style={[styles.cardTitle, isCancelled && styles.cardTitleCancelled]}>
            {item.title}
          </Text>
          {isCancelled ? (
            <Text style={styles.cardTypeMuted}>{item.type}</Text>
          ) : null}
          <View style={styles.cardMeta}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.cardMetaText}>
              {formatAppointmentDisplayDate(item.dateISO)} · {item.timeLabel}
            </Text>
          </View>
          <View style={styles.cardMeta}>
            <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.cardMetaText} numberOfLines={2}>
              {item.location}
            </Text>
          </View>
          {item.notes ? (
            <Text style={styles.cardNotes}>{item.notes}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.subtitle}>
          Visits and labs with your care team. Tap a visit to edit, or cancel a visit you no longer
          need.
        </Text>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <Text style={styles.sectionCount}>{upcoming.length}</Text>
        </View>
        {upcoming.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={40} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>No upcoming visits</Text>
            <Text style={styles.emptyBody}>
              Add your next ultrasound, blood draw, or consult — we’ll keep it here.
            </Text>
          </View>
        ) : (
          upcoming.map(renderCard)
        )}

        {cancelled.length > 0 ? (
          <>
            <View style={[styles.sectionHead, styles.sectionPast]}>
              <Text style={styles.sectionTitle}>Cancelled</Text>
              <Text style={styles.sectionCount}>{cancelled.length}</Text>
            </View>
            {cancelled.map(renderCard)}
          </>
        ) : null}

        <View style={[styles.sectionHead, styles.sectionPast]}>
          <Text style={styles.sectionTitle}>Past</Text>
          <Text style={styles.sectionCount}>{past.length}</Text>
        </View>
        {past.length === 0 ? (
          <Text style={styles.pastEmpty}>Past appointments will show here after the date passes.</Text>
        ) : (
          past.map(renderCard)
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={openNew}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Add appointment"
      >
        <Ionicons name="add" size={28} color={Colors.textWhite} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <SafeAreaView style={styles.modalSafe} edges={['top']}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={closeModal}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Text style={styles.modalCancel}>Close</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingId ? 'Edit appointment' : 'New appointment'}
              </Text>
              <TouchableOpacity
                onPress={handleSave}
                disabled={!canSave}
                accessibilityRole="button"
                accessibilityLabel="Save appointment"
              >
                <Text style={[styles.modalSave, !canSave && styles.modalSaveDisabled]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>

            {editingAppointment?.status === 'cancelled' ? (
              <View style={styles.cancelledBanner}>
                <Ionicons name="information-circle" size={20} color={Colors.warning} />
                <Text style={styles.cancelledBannerText}>
                  This visit was cancelled. Update details below or restore it to your schedule.
                </Text>
              </View>
            ) : null}

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Monitoring ultrasound"
                placeholderTextColor={Colors.textTertiary}
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.inputLabel}>Type</Text>
              <View style={styles.typeRow}>
                {APPOINTMENT_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeChip, type === t && styles.typeChipActive]}
                    onPress={() => setType(t)}
                  >
                    <Text
                      style={[styles.typeChipText, type === t && styles.typeChipTextActive]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="2026-05-20"
                placeholderTextColor={Colors.textTertiary}
                value={dateISO}
                onChangeText={setDateISO}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.input}
                placeholder="10:30 AM"
                placeholderTextColor={Colors.textTertiary}
                value={timeLabel}
                onChangeText={setTimeLabel}
              />

              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Clinic name or address"
                placeholderTextColor={Colors.textTertiary}
                value={location}
                onChangeText={setLocation}
              />

              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Bring ID, fasting, etc."
                placeholderTextColor={Colors.textTertiary}
                value={notes}
                onChangeText={setNotes}
                multiline
              />

              {editingId && editingAppointment?.status === 'scheduled' ? (
                <TouchableOpacity
                  style={styles.cancelVisitBtn}
                  onPress={handleCancelVisit}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel this appointment"
                >
                  <Ionicons name="close-circle-outline" size={20} color={Colors.error} />
                  <Text style={styles.cancelVisitBtnText}>Cancel this visit</Text>
                </TouchableOpacity>
              ) : null}

              {editingId && editingAppointment?.status === 'cancelled' ? (
                <TouchableOpacity
                  style={styles.restoreBtn}
                  onPress={handleRestoreVisit}
                  accessibilityRole="button"
                  accessibilityLabel="Restore visit to schedule"
                >
                  <Ionicons name="refresh" size={20} color={Colors.success} />
                  <Text style={styles.restoreBtnText}>Restore to schedule</Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionPast: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  sectionCount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.accentPrimary,
    backgroundColor: Colors.bgSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  cardCancelled: {
    opacity: 0.92,
    backgroundColor: Colors.bgSecondary,
  },
  cardTop: {
    gap: Spacing.xs,
  },
  cardRowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editHintText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.accentPrimary,
  },
  typePill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.phase2Bg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  typePillCancelled: {
    backgroundColor: '#FEE2E2',
  },
  typePillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.phase2Text,
  },
  typePillTextCancelled: {
    color: Colors.error,
  },
  cardTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  cardTitleCancelled: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  cardTypeMuted: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    marginTop: 4,
  },
  cardMetaText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  cardNotes: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptyBody: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  pastEmpty: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
  modalRoot: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  modalSafe: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.bgWhite,
  },
  modalCancel: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  modalTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  modalSave: {
    fontSize: FontSize.base,
    color: Colors.accentPrimary,
    fontWeight: FontWeight.semibold,
  },
  modalSaveDisabled: {
    opacity: 0.35,
  },
  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: '#FFFBEB',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  cancelledBannerText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: 6,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.bgWhite,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  inputMultiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.bgWhite,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeChipActive: {
    backgroundColor: Colors.phase2Bg,
    borderColor: Colors.accentPrimary,
  },
  typeChipText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  typeChipTextActive: {
    color: Colors.phase2Text,
    fontWeight: FontWeight.semibold,
  },
  cancelVisitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  cancelVisitBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
  },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  restoreBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.success,
  },
});
