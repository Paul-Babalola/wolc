-- RSVPs for auto-generated recurring events (Bible Study, Sunday Service, etc.)

create table if not exists public.recurring_rsvps (
  id         uuid primary key default gen_random_uuid(),
  event_key  text not null,
  slug       text not null,
  starts_at  timestamptz not null,
  name       text not null,
  email      text not null,
  guests     int not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists recurring_rsvps_event_key_idx on public.recurring_rsvps (event_key);

alter table public.recurring_rsvps enable row level security;
