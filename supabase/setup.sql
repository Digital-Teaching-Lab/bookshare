-- Run once in the Supabase project's SQL Editor. Re-running is safe.
create table if not exists public.recommendations (
 id text primary key,
 owner uuid not null references auth.users(id) on delete cascade,
 name text not null check (char_length(name) between 1 and 50),
 title text not null check (char_length(title) between 1 and 200),
 reason text not null default '' check (char_length(reason) <= 3000),
 date date not null,
 photo text,
 audio text,
 cover text,
 link text,
 provider text,
 author text not null default '',
 publisher text not null default '',
 created timestamptz not null default now(),
 constraint recommendation_content check (reason <> '' or audio is not null),
 constraint photo_owner check (photo is null or split_part(photo,'/',1) = owner::text),
 constraint audio_owner check (audio is null or split_part(audio,'/',1) = owner::text)
);
create index if not exists recommendations_owner_created on public.recommendations(owner,created desc);
create table if not exists public.teacher_settings (
 owner uuid primary key references auth.users(id) on delete cascade,
 class_name text not null check (char_length(class_name) between 1 and 40)
);
alter table public.recommendations enable row level security;
alter table public.teacher_settings enable row level security;
revoke all on public.recommendations,public.teacher_settings from anon;
grant select,insert,update,delete on public.recommendations,public.teacher_settings to authenticated;
drop policy if exists own_recommendations on public.recommendations;
create policy own_recommendations on public.recommendations for all to authenticated
 using ((select auth.uid())=owner) with check ((select auth.uid())=owner);
drop policy if exists own_teacher_settings on public.teacher_settings;
create policy own_teacher_settings on public.teacher_settings for all to authenticated
 using ((select auth.uid())=owner) with check ((select auth.uid())=owner);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('bookshare-media','bookshare-media',false,12582912,
 array['image/jpeg','image/png','image/webp','audio/webm','audio/mp4','audio/ogg'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists bookshare_own_media_select on storage.objects;
create policy bookshare_own_media_select on storage.objects for select to authenticated
 using (bucket_id='bookshare-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists bookshare_own_media_insert on storage.objects;
create policy bookshare_own_media_insert on storage.objects for insert to authenticated
 with check (bucket_id='bookshare-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists bookshare_own_media_delete on storage.objects;
create policy bookshare_own_media_delete on storage.objects for delete to authenticated
 using (bucket_id='bookshare-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
