import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { isSupabaseConfigured } from '../lib/supabaseConfig';
import {
  createLabUpload,
  deleteLabUpload,
  fetchLabUploads,
} from '../services/labUploadService';
import type { LabUpload, UploadCategory } from '../types/labUpload';

export function useFileUploads(category: UploadCategory) {
  const cloudStorageEnabled = isSupabaseConfigured();
  const [uploads, setUploads] = useState<LabUpload[]>([]);
  const [loading, setLoading] = useState(cloudStorageEnabled);

  const loadUploads = useCallback(async () => {
    if (!cloudStorageEnabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const remote = await fetchLabUploads(category);
      setUploads(remote);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load uploads.';
      Alert.alert('Could not load uploads', message);
    } finally {
      setLoading(false);
    }
  }, [category, cloudStorageEnabled]);

  useEffect(() => {
    loadUploads();
  }, [loadUploads]);

  const addUpload = useCallback(
    async (upload: Omit<LabUpload, 'id' | 'uploadedAt' | 'status' | 'category'>) => {
      const tempId = `upload-${Date.now()}`;
      const optimistic: LabUpload = {
        ...upload,
        category,
        id: tempId,
        uploadedAt: new Date().toISOString(),
        status: 'processing',
      };

      setUploads((prev) => [optimistic, ...prev]);

      if (!cloudStorageEnabled) {
        setTimeout(() => {
          setUploads((prev) =>
            prev.map((item) => (item.id === tempId ? { ...item, status: 'saved' as const } : item))
          );
        }, 1500);
        return optimistic;
      }

      try {
        const saved = await createLabUpload({ ...upload, category });
        setUploads((prev) => prev.map((item) => (item.id === tempId ? saved : item)));
        return saved;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed.';
        setUploads((prev) =>
          prev.map((item) =>
            item.id === tempId ? { ...item, status: 'failed' as const } : item
          )
        );
        Alert.alert('Upload failed', message);
        return optimistic;
      }
    },
    [category, cloudStorageEnabled]
  );

  const removeUpload = useCallback(
    async (id: string) => {
      const target = uploads.find((u) => u.id === id);
      if (!target) return;

      setUploads((prev) => prev.filter((u) => u.id !== id));

      if (!cloudStorageEnabled || !target.storagePath) {
        return;
      }

      try {
        await deleteLabUpload(target);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not delete file.';
        setUploads((prev) => [target, ...prev]);
        Alert.alert('Delete failed', message);
      }
    },
    [cloudStorageEnabled, uploads]
  );

  return {
    uploads,
    loading,
    cloudStorageEnabled,
    addUpload,
    removeUpload,
    reload: loadUploads,
  };
}
