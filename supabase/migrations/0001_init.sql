-- Word of Life Center: dynamic data schema

create table if not exists public.events (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  starts_at    timestamptz not null,
  ends_at      timestamptz,
  location     text,
  summary      text,
  description  text,
  image_url    text,
  register_url text,
  capacity     int,
  published    boolean not null default true,
  created_at   timestamptz not null default now()
);
create index if not exists events_starts_at_idx on public.events (starts_at);

create table if not exists public.rsvps (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events (id) on delete cascade,
  name       text not null,
  email      text not null,
  guests     int not null default 1,
  created_at timestamptz not null default now()
);
create index if not exists rsvps_event_id_idx on public.rsvps (event_id);

create table if not exists public.prayer_requests (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text,
  message    text not null,
  is_private boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null default 'contact',
  name       text not null,
  email      text not null,
  phone      text,
  message    text,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz not null default now()
);

alter table public.events                 enable row level security;
alter table public.rsvps                  enable row level security;
alter table public.prayer_requests        enable row level security;
alter table public.contact_messages       enable row level security;
alter table public.newsletter_subscribers enable row level security;
