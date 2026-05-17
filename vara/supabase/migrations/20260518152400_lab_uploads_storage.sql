-- Lab uploads metadata + private storage bucket (applied via Supabase MCP)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lab-uploads',
  'lab-uploads',
  false,
  20971520,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']
)
on conflict (id) do nothing;

create table if not exists public.lab_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  kind text not null check (kind in ('screenshot', 'lab_report')),
  source text not null check (source in ('inito', 'kegg', 'clinic', 'other')),
  status text not null default 'processing' check (status in ('processing', 'saved', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lab_uploads_user_id_created_at_idx
  on public.lab_uploads (user_id, created_at desc);

create or replace function public.set_lab_uploads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists lab_uploads_set_updated_at on public.lab_uploads;
create trigger lab_uploads_set_updated_at
before update on public.lab_uploads
for each row execute function public.set_lab_uploads_updated_at();

alter table public.lab_uploads enable row level security;

drop policy if exists "lab_uploads_select_own" on public.lab_uploads;
create policy "lab_uploads_select_own"
  on public.lab_uploads for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "lab_uploads_insert_own" on public.lab_uploads;
create policy "lab_uploads_insert_own"
  on public.lab_uploads for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "lab_uploads_update_own" on public.lab_uploads;
create policy "lab_uploads_update_own"
  on public.lab_uploads for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "lab_uploads_delete_own" on public.lab_uploads;
create policy "lab_uploads_delete_own"
  on public.lab_uploads for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "lab_uploads_storage_select_own" on storage.objects;
create policy "lab_uploads_storage_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'lab-uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "lab_uploads_storage_insert_own" on storage.objects;
create policy "lab_uploads_storage_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'lab-uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "lab_uploads_storage_delete_own" on storage.objects;
create policy "lab_uploads_storage_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'lab-uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
