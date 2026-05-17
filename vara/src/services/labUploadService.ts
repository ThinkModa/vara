import { getSupabase } from '../lib/supabase';
import { ensureSupabaseSession } from '../lib/ensureSupabaseSession';
import { isSupabaseConfigured, LAB_UPLOADS_BUCKET } from '../lib/supabaseConfig';
import type {
  LabUpload,
  LabUploadKind,
  LabUploadSource,
  LabUploadStatus,
  UploadCategory,
} from '../types/labUpload';

const SIGNED_URL_TTL_SECONDS = 60 * 60;

function createUploadId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

interface LabUploadRow {
  id: string;
  user_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  kind: LabUploadKind;
  source: LabUploadSource;
  category: UploadCategory;
  status: LabUploadStatus;
  created_at: string;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}

async function uriToArrayBuffer(uri: string): Promise<ArrayBuffer> {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error('Could not read the selected file.');
  }
  return response.arrayBuffer();
}

async function signedUrlForPath(storagePath: string): Promise<string | undefined> {
  const supabase = getSupabase();
  const { data, error } = await supabase.storage
    .from(LAB_UPLOADS_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    console.warn('[Supabase] Signed URL failed:', error?.message);
    return undefined;
  }

  return data.signedUrl;
}

function rowToLabUpload(row: LabUploadRow, localUri?: string, signed?: string): LabUpload {
  return {
    id: row.id,
    uri: localUri ?? signed ?? '',
    fileName: row.file_name,
    mimeType: row.mime_type ?? undefined,
    kind: row.kind,
    source: row.source,
    category: row.category,
    status: row.status,
    uploadedAt: row.created_at,
    storagePath: row.storage_path,
    remoteUrl: signed,
  };
}

async function rowToLabUploadWithSignedUrl(row: LabUploadRow, localUri?: string): Promise<LabUpload> {
  const signed = row.status === 'saved' ? await signedUrlForPath(row.storage_path) : undefined;
  return rowToLabUpload(row, localUri, signed);
}

export async function fetchLabUploads(category: UploadCategory): Promise<LabUpload[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const ready = await ensureSupabaseSession();
  if (!ready) {
    return [];
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('lab_uploads')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as LabUploadRow[];
  return Promise.all(rows.map((row) => rowToLabUploadWithSignedUrl(row)));
}

export interface CreateLabUploadInput {
  uri: string;
  fileName: string;
  mimeType?: string;
  kind: LabUploadKind;
  source: LabUploadSource;
  category: UploadCategory;
}

export async function createLabUpload(input: CreateLabUploadInput): Promise<LabUpload> {
  if (!isSupabaseConfigured()) {
    throw new Error('Cloud storage is not configured.');
  }

  const ready = await ensureSupabaseSession();
  if (!ready) {
    throw new Error(
      'Could not start a secure session. Enable Anonymous sign-ins in Supabase (Authentication → Providers).'
    );
  }

  const supabase = getSupabase();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Not signed in to cloud storage.');
  }

  const uploadId = createUploadId();
  const safeName = sanitizeFileName(input.fileName);
  const storagePath = `${user.id}/${uploadId}/${safeName}`;

  const { data: row, error: insertError } = await supabase
    .from('lab_uploads')
    .insert({
      id: uploadId,
      user_id: user.id,
      storage_path: storagePath,
      file_name: input.fileName,
      mime_type: input.mimeType ?? null,
      kind: input.kind,
      source: input.source,
      category: input.category,
      status: 'processing',
    })
    .select('*')
    .single();

  if (insertError || !row) {
    throw new Error(insertError?.message ?? 'Could not create upload record.');
  }

  try {
    const fileBytes = await uriToArrayBuffer(input.uri);
    const { error: storageError } = await supabase.storage
      .from(LAB_UPLOADS_BUCKET)
      .upload(storagePath, fileBytes, {
        contentType: input.mimeType ?? 'application/octet-stream',
        upsert: false,
      });

    if (storageError) {
      throw storageError;
    }

    const { data: updated, error: updateError } = await supabase
      .from('lab_uploads')
      .update({ status: 'saved' })
      .eq('id', uploadId)
      .select('*')
      .single();

    if (updateError || !updated) {
      throw new Error(updateError?.message ?? 'Upload saved but status update failed.');
    }

    return rowToLabUploadWithSignedUrl(updated as LabUploadRow, input.uri);
  } catch (error) {
    await supabase.from('lab_uploads').update({ status: 'failed' }).eq('id', uploadId);
    await supabase.storage.from(LAB_UPLOADS_BUCKET).remove([storagePath]);
    const message = error instanceof Error ? error.message : 'Upload failed.';
    throw new Error(message);
  }
}

export async function deleteLabUpload(upload: LabUpload): Promise<void> {
  if (!isSupabaseConfigured() || !upload.storagePath) {
    return;
  }

  await ensureSupabaseSession();
  const supabase = getSupabase();

  await supabase.storage.from(LAB_UPLOADS_BUCKET).remove([upload.storagePath]);
  const { error } = await supabase.from('lab_uploads').delete().eq('id', upload.id);

  if (error) {
    throw new Error(error.message);
  }
}
