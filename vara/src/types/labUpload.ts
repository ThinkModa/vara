export type UploadCategory = 'clinical_labs' | 'device_tracking';

export type ClinicalLabSource = 'clinic' | 'blood_work' | 'other_lab';

export type DeviceTrackingSource = 'inito' | 'kegg';

export type LabUploadSource = ClinicalLabSource | DeviceTrackingSource;

export type LabUploadKind = 'screenshot' | 'lab_report';

export type LabUploadStatus = 'processing' | 'saved' | 'failed';

export interface LabUpload {
  id: string;
  uri: string;
  fileName: string;
  mimeType?: string;
  kind: LabUploadKind;
  source: LabUploadSource;
  category: UploadCategory;
  uploadedAt: string;
  status: LabUploadStatus;
  storagePath?: string;
  remoteUrl?: string;
}

export const LAB_UPLOAD_SOURCE_LABELS: Record<LabUploadSource, string> = {
  inito: 'Inito',
  kegg: 'Kegg',
  clinic: 'Clinic / fertility lab',
  blood_work: 'Blood work (Quest, Labcorp, etc.)',
  other_lab: 'Other lab report',
};

export const CLINICAL_LAB_SOURCES: ClinicalLabSource[] = ['clinic', 'blood_work', 'other_lab'];

export const DEVICE_TRACKING_SOURCES: DeviceTrackingSource[] = ['inito', 'kegg'];
