-- Public read access for published events (defense in depth for direct Supabase access)

create policy "Public read published events"
  on public.events
  for select
  using (published = true);
