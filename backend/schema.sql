-- Run this in your Supabase SQL Editor

create table if not exists jobs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  company     text,
  skills      text,
  date        text,
  url         text,
  source      text,
  created_at  timestamptz default now()
);

-- Index for fast queries
create index if not exists jobs_created_at_idx on jobs (created_at desc);
create index if not exists jobs_source_idx     on jobs (source);

-- Enable Row Level Security
alter table jobs enable row level security;

-- Allow public read (for the website)
create policy "Public can read jobs"
  on jobs for select
  using (true);

-- Allow insert from service role only (bot uses service key)
create policy "Service can insert jobs"
  on jobs for insert
  with check (true);