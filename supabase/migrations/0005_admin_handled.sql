-- Track staff follow-up on inbound messages

alter table public.contact_messages
  add column if not exists handled_at timestamptz;

alter table public.prayer_requests
  add column if not exists handled_at timestamptz;

create index if not exists contact_messages_handled_at_idx
  on public.contact_messages (handled_at);

create index if not exists prayer_requests_handled_at_idx
  on public.prayer_requests (handled_at);
