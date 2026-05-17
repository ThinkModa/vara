-- Split uploads: clinical_labs (blood work, clinic) vs device_tracking (Inito, Kegg)

alter table public.lab_uploads
  add column if not exists category text;

update public.lab_uploads
set category = case
  when source in ('inito', 'kegg') then 'device_tracking'
  else 'clinical_labs'
end
where category is null;

alter table public.lab_uploads
  alter column category set default 'clinical_labs';

alter table public.lab_uploads
  alter column category set not null;

alter table public.lab_uploads
  drop constraint if exists lab_uploads_source_check;

alter table public.lab_uploads
  add constraint lab_uploads_source_check
  check (source in ('inito', 'kegg', 'clinic', 'blood_work', 'other_lab'));

alter table public.lab_uploads
  drop constraint if exists lab_uploads_category_check;

alter table public.lab_uploads
  add constraint lab_uploads_category_check
  check (category in ('clinical_labs', 'device_tracking'));

create index if not exists lab_uploads_user_category_created_idx
  on public.lab_uploads (user_id, category, created_at desc);
