import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Colors } from '../constants/colors';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '../constants/spacing';
import type {
  LabUpload,
  LabUploadKind,
  LabUploadSource,
  UploadCategory,
} from '../types/labUpload';
import {
  CLINICAL_LAB_SOURCES,
  DEVICE_TRACKING_SOURCES,
  LAB_UPLOAD_SOURCE_LABELS,
} from '../types/labUpload';

interface PendingUpload {
  uri: string;
  fileName: string;
  mimeType?: string;
  kind: LabUploadKind;
}

interface FileUploadSectionProps {
  variant: UploadCategory;
  uploads: LabUpload[];
  cloudStorageEnabled?: boolean;
  onAddUpload: (
    upload: Omit<LabUpload, 'id' | 'uploadedAt' | 'status' | 'category'>
  ) => void | Promise<void>;
  onRemoveUpload: (id: string) => void | Promise<void>;
}

const VARIANT_CONFIG = {
  clinical_labs: {
    title: 'Import lab results',
    subtitleCloud:
      'Upload blood work, clinic panels, or PDFs from your lab portal. Files are stored securely in your account.',
    subtitleLocal:
      'Upload blood work, clinic panels, or lab PDFs. Connect Supabase in .env for cloud storage.',
    pills: ['Blood work', 'Clinic panels', 'PDF reports'],
    sourceOptions: CLINICAL_LAB_SOURCES,
    sourceModalTitle: 'What type of lab result?',
    sourceModalSubtitle: 'This helps organize blood work and clinic reports.',
    emptyTitle: 'No lab files yet',
    emptyBody: 'Photograph a printout, import a PDF from your portal, or add a photo from your camera roll.',
    libraryPermission:
      'Allow photo access to import lab result photos and screenshots from your camera roll.',
    cameraPermission: 'Allow camera access to photograph lab printouts.',
    listTitle: 'Your lab files',
    showDocumentPicker: true,
    cameraLabel: 'Camera',
    libraryLabel: 'Photo library',
  },
  device_tracking: {
    title: 'Import device data',
    subtitleCloud:
      'Add screenshots from Inito or Kegg. We will surface insights from your uploads on this page.',
    subtitleLocal:
      'Add screenshots from Inito or Kegg. Connect Supabase in .env to save uploads and see insights.',
    pills: ['Inito', 'Kegg'],
    sourceOptions: DEVICE_TRACKING_SOURCES,
    sourceModalTitle: 'Which device is this from?',
    sourceModalSubtitle: 'Tagging helps us tailor insights from Inito or Kegg charts.',
    emptyTitle: 'No device uploads yet',
    emptyBody: 'Share a chart from Inito or Kegg to Photos, then tap Photo library to import.',
    libraryPermission:
      'Allow photo access to import Inito and Kegg screenshots from your camera roll.',
    cameraPermission: 'Allow camera access to photograph your device screen.',
    listTitle: 'Your device uploads',
    showDocumentPicker: false,
    cameraLabel: 'Photo of screen',
    libraryLabel: 'Photo library',
  },
} as const;

function uploadStatusLabel(status: LabUpload['status'], cloud: boolean): string {
  switch (status) {
    case 'processing':
      return cloud ? 'Uploading to secure storage…' : 'Saving on this device…';
    case 'saved':
      return cloud ? 'Saved to your account' : 'Saved on this device';
    case 'failed':
      return 'Could not save — try again';
  }
}

function formatUploadDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isPdf(mimeType?: string, fileName?: string): boolean {
  if (mimeType === 'application/pdf') return true;
  return fileName?.toLowerCase().endsWith('.pdf') ?? false;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  variant,
  uploads,
  cloudStorageEnabled = false,
  onAddUpload,
  onRemoveUpload,
}) => {
  const config = VARIANT_CONFIG[variant];
  const [sourceModalVisible, setSourceModalVisible] = useState(false);
  const [previewUpload, setPreviewUpload] = useState<LabUpload | null>(null);
  const [pending, setPending] = useState<PendingUpload | null>(null);

  const requestLibraryPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Photos access needed', config.libraryPermission);
      return false;
    }
    return true;
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera access needed', config.cameraPermission);
      return false;
    }
    return true;
  };

  const openSourcePicker = (file: PendingUpload) => {
    setPending(file);
    setSourceModalVisible(true);
  };

  const confirmSource = (source: LabUploadSource) => {
    if (!pending) return;
    onAddUpload({
      uri: pending.uri,
      fileName: pending.fileName,
      mimeType: pending.mimeType,
      kind: pending.kind,
      source,
    });
    setPending(null);
    setSourceModalVisible(false);
  };

  const pickFromLibrary = async () => {
    if (!(await requestLibraryPermission())) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      allowsMultipleSelection: false,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    openSourcePicker({
      uri: asset.uri,
      fileName: asset.fileName ?? `import-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? 'image/jpeg',
      kind: 'screenshot',
    });
  };

  const pickFromCamera = async () => {
    if (!(await requestCameraPermission())) return;

    const result = await ImagePicker.launchCameraAsync({ quality: 0.9 });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    openSourcePicker({
      uri: asset.uri,
      fileName: asset.fileName ?? `photo-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? 'image/jpeg',
      kind: 'screenshot',
    });
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const kind: LabUploadKind = isPdf(asset.mimeType, asset.name) ? 'lab_report' : 'screenshot';

    openSourcePicker({
      uri: asset.uri,
      fileName: asset.name,
      mimeType: asset.mimeType ?? undefined,
      kind,
    });
  };

  const handleRemove = (upload: LabUpload) => {
    Alert.alert('Remove file?', upload.fileName, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => onRemoveUpload(upload.id) },
    ]);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{config.title}</Text>
        <Text style={styles.sectionSubtitle}>
          {cloudStorageEnabled ? config.subtitleCloud : config.subtitleLocal}
        </Text>
      </View>

      <View style={styles.compatRow}>
        {config.pills.map((pill, index) => (
          <View
            key={pill}
            style={[styles.compatPill, index === config.pills.length - 1 && variant === 'clinical_labs' && styles.compatPillMuted]}
          >
            <Text
              style={
                index === config.pills.length - 1 && variant === 'clinical_labs'
                  ? styles.compatPillTextMuted
                  : styles.compatPillText
              }
            >
              {pill}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={pickFromLibrary}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={config.libraryLabel}
        >
          <Ionicons name="images-outline" size={22} color={Colors.accentPrimary} />
          <Text style={styles.actionButtonText}>{config.libraryLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={pickFromCamera}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={config.cameraLabel}
        >
          <Ionicons name="camera-outline" size={22} color={Colors.accentPrimary} />
          <Text style={styles.actionButtonText}>{config.cameraLabel}</Text>
        </TouchableOpacity>
      </View>

      {config.showDocumentPicker && (
        <TouchableOpacity
          style={styles.documentButton}
          onPress={pickDocument}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Import lab report PDF or image file"
        >
          <Ionicons name="document-text-outline" size={22} color={Colors.accentSecondary} />
          <View style={styles.documentButtonTextWrap}>
            <Text style={styles.documentButtonTitle}>Lab report or PDF</Text>
            <Text style={styles.documentButtonHint}>Quest, Labcorp, clinic portal</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
        </TouchableOpacity>
      )}

      {uploads.length > 0 ? (
        <View style={styles.uploadList}>
          <Text style={styles.uploadListTitle}>{config.listTitle}</Text>
          {uploads.map((upload) => {
            const pdf = isPdf(upload.mimeType, upload.fileName);
            const isProcessing = upload.status === 'processing';
            const isSaved = upload.status === 'saved';

            return (
              <TouchableOpacity
                key={upload.id}
                style={[styles.uploadCard, isProcessing && styles.uploadCardProcessing]}
                onPress={() => {
                  if (isProcessing) return;
                  if (pdf) {
                    Alert.alert(
                      'File saved',
                      cloudStorageEnabled
                        ? `${upload.fileName} is stored in your account. PDF preview is coming soon.`
                        : `${upload.fileName} is stored on this device. PDF preview is coming soon.`,
                      [{ text: 'OK' }]
                    );
                    return;
                  }
                  setPreviewUpload(upload);
                }}
                onLongPress={() => !isProcessing && handleRemove(upload)}
                activeOpacity={isProcessing ? 1 : 0.85}
                accessibilityRole="button"
              >
                {pdf ? (
                  <View style={styles.pdfThumb}>
                    <Ionicons name="document" size={28} color={Colors.accentSecondary} />
                  </View>
                ) : (
                  <Image
                    source={{ uri: upload.uri || upload.remoteUrl || '' }}
                    style={styles.uploadThumb}
                  />
                )}
                <View style={styles.uploadMeta}>
                  <Text style={styles.uploadName} numberOfLines={1}>
                    {upload.fileName}
                  </Text>
                  <Text style={styles.uploadSource}>
                    {LAB_UPLOAD_SOURCE_LABELS[upload.source]} · {formatUploadDate(upload.uploadedAt)}
                  </Text>
                  <View style={styles.uploadStatusRow}>
                    {isProcessing ? (
                      <ActivityIndicator size="small" color={Colors.accentPrimary} />
                    ) : (
                      <Ionicons
                        name={isSaved ? 'checkmark-circle' : 'alert-circle'}
                        size={14}
                        color={isSaved ? Colors.success : Colors.error}
                      />
                    )}
                    <Text
                      style={[
                        styles.uploadStatusText,
                        isSaved && styles.uploadStatusSaved,
                        upload.status === 'failed' && styles.uploadStatusFailed,
                      ]}
                    >
                      {uploadStatusLabel(upload.status, cloudStorageEnabled)}
                    </Text>
                  </View>
                </View>
                {!isProcessing && (
                  <TouchableOpacity
                    onPress={() => handleRemove(upload)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${upload.fileName}`}
                  >
                    <Ionicons name="trash-outline" size={20} color={Colors.textTertiary} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
          <Text style={styles.uploadHint}>Long-press a file to remove it.</Text>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="cloud-upload-outline" size={32} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>{config.emptyTitle}</Text>
          <Text style={styles.emptyBody}>{config.emptyBody}</Text>
        </View>
      )}

      <Modal
        visible={sourceModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setSourceModalVisible(false);
          setPending(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{config.sourceModalTitle}</Text>
            <Text style={styles.modalSubtitle}>{config.sourceModalSubtitle}</Text>
            {config.sourceOptions.map((source) => (
              <TouchableOpacity
                key={source}
                style={styles.sourceOption}
                onPress={() => confirmSource(source)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={LAB_UPLOAD_SOURCE_LABELS[source]}
              >
                <Text style={styles.sourceOptionText}>{LAB_UPLOAD_SOURCE_LABELS[source]}</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => {
                setSourceModalVisible(false);
                setPending(null);
              }}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={previewUpload !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewUpload(null)}
      >
        <View style={styles.previewOverlay}>
          <TouchableOpacity
            style={styles.previewClose}
            onPress={() => setPreviewUpload(null)}
            accessibilityRole="button"
            accessibilityLabel="Close preview"
          >
            <Ionicons name="close" size={28} color={Colors.textWhite} />
          </TouchableOpacity>
          {previewUpload && !isPdf(previewUpload.mimeType, previewUpload.fileName) && (
            <ScrollView contentContainerStyle={styles.previewScroll} centerContent>
              <Image
                source={{ uri: previewUpload.uri || previewUpload.remoteUrl || '' }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            </ScrollView>
          )}
          {previewUpload && (
            <Text style={styles.previewCaption}>{previewUpload.fileName}</Text>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: Spacing.sm },
  sectionHeader: { marginBottom: Spacing.sm },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  compatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  compatPill: {
    backgroundColor: Colors.phase2Bg,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  compatPillMuted: { backgroundColor: Colors.divider },
  compatPillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.phase2Text,
  },
  compatPillTextMuted: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    ...Shadow.sm,
  },
  actionButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  documentButtonTextWrap: { flex: 1 },
  documentButtonTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  documentButtonHint: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  uploadList: { marginTop: Spacing.xs },
  uploadListTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  uploadThumb: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.divider,
  },
  pdfThumb: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.phase2Bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadMeta: { flex: 1 },
  uploadName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  uploadSource: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  uploadCardProcessing: {
    opacity: 0.85,
    borderColor: Colors.accentPrimary,
  },
  uploadStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  uploadStatusText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  uploadStatusSaved: { color: Colors.success },
  uploadStatusFailed: { color: Colors.error },
  uploadHint: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.bgWhite,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  emptyBody: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.bgWhite,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  sourceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  sourceOptionText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  modalCancel: { alignItems: 'center', paddingTop: Spacing.md },
  modalCancelText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textTertiary,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    justifyContent: 'center',
  },
  previewClose: {
    position: 'absolute',
    top: 56,
    right: Spacing.lg,
    zIndex: 2,
    padding: Spacing.sm,
  },
  previewScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 80,
  },
  previewImage: { width: '100%', height: 480 },
  previewCaption: {
    fontSize: FontSize.sm,
    color: Colors.textWhite,
    textAlign: 'center',
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    opacity: 0.85,
  },
});
