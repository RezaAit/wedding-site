# Supabase Setup — Wedding Site

## ধাপ ১: SQL Editor-এ এই query চালান

```sql
-- দোয়া table
create table if not exists duas (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  message text not null,
  created_at timestamptz default now()
);
alter table duas enable row level security;
create policy "public read"   on duas for select using (true);
create policy "public insert" on duas for insert with check (true);

-- Media table
create table if not exists media (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  type text not null,
  name text,
  created_at timestamptz default now()
);
alter table media enable row level security;
create policy "public read"   on media for select using (true);
create policy "public insert" on media for insert with check (true);
```

## ধাপ ২: Storage Bucket বানান

1. Left sidebar → Storage → New bucket
2. Name: `wedding-media`
3. Public: ON করুন
4. Save

## ধাপ ৩: Storage Policy যোগ করুন

SQL Editor-এ চালান:
```sql
create policy "public upload"
on storage.objects for insert
with check (bucket_id = 'wedding-media');

create policy "public read"
on storage.objects for select
using (bucket_id = 'wedding-media');
```

## ধাপ ৪: anon key নিন

Settings → API → `anon public` key কপি করুন
`.env.local` এ NEXT_PUBLIC_SUPABASE_ANON_KEY এ বসান

## ধাপ ৫: Vercel-এ environment variables

Vercel Dashboard → Project → Settings → Environment Variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## RSVP Table (নতুন — SQL Editor-এ চালান)

```sql
create table if not exists rsvp (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  guests integer default 1,
  relation text,
  message text,
  created_at timestamptz default now()
);

alter table rsvp enable row level security;
create policy "public read"   on rsvp for select using (true);
create policy "public insert" on rsvp for insert with check (true);
```
