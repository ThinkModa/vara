import type { LabUpload } from '../types/labUpload';
import { LAB_UPLOAD_SOURCE_LABELS } from '../types/labUpload';

export interface DeviceInsight {
  id: string;
  icon: string;
  title: string;
  body: string;
  color: 'purple' | 'pink' | 'blue' | 'green';
  sourceLabel: string;
}

export function getDeviceInsights(uploads: LabUpload[]): DeviceInsight[] {
  const saved = uploads.filter((u) => u.status === 'saved');
  if (saved.length === 0) {
    return [];
  }

  const hasInito = saved.some((u) => u.source === 'inito');
  const hasKegg = saved.some((u) => u.source === 'kegg');
  const insights: DeviceInsight[] = [];

  if (hasInito) {
    insights.push({
      id: 'inito-lh',
      icon: 'trending-up',
      title: 'LH pattern looks steady',
      body:
        'Based on your Inito upload, hormone readings appear consistent with your current cycle day. Keep testing on schedule for the clearest trend.',
      color: 'purple',
      sourceLabel: LAB_UPLOAD_SOURCE_LABELS.inito,
    });
    insights.push({
      id: 'inito-timing',
      icon: 'time-outline',
      title: 'Best time to test',
      body:
        'Inito charts are easiest to read with first-morning tests. Try the same window tomorrow for a smoother comparison line.',
      color: 'blue',
      sourceLabel: LAB_UPLOAD_SOURCE_LABELS.inito,
    });
  }

  if (hasKegg) {
    insights.push({
      id: 'kegg-cm',
      icon: 'water-outline',
      title: 'Cervical fluid trend noted',
      body:
        'Your Kegg upload suggests fertile-quality patterns may be building. Pair this with your clinic monitoring for timing decisions.',
      color: 'pink',
      sourceLabel: LAB_UPLOAD_SOURCE_LABELS.kegg,
    });
    insights.push({
      id: 'kegg-rhythm',
      icon: 'pulse',
      title: 'Cycle rhythm check-in',
      body:
        'Kegg data fits your current follicular phase. Log again after your next ultrasound or lab draw to see how patterns align.',
      color: 'green',
      sourceLabel: LAB_UPLOAD_SOURCE_LABELS.kegg,
    });
  }

  if (hasInito && hasKegg) {
    insights.push({
      id: 'combined',
      icon: 'sparkles',
      title: 'Inito + Kegg together',
      body:
        'You have uploads from both devices. Hormone and cervical fluid signals together can give a fuller picture—bring both charts to your next visit.',
      color: 'purple',
      sourceLabel: 'Inito & Kegg',
    });
  }

  const latest = saved[0];
  if (insights.length === 0 && latest) {
    insights.push({
      id: 'generic',
      icon: 'sparkles',
      title: 'Upload received',
      body:
        'Your chart is saved. We will surface richer insights as we learn your patterns across more uploads.',
      color: 'blue',
      sourceLabel: LAB_UPLOAD_SOURCE_LABELS[latest.source],
    });
  }

  return insights;
}
