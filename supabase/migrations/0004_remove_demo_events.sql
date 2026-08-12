-- Remove placeholder seed events from the public calendar
delete from public.events
where slug in (
  'encounter-night',
  'young-adults-hangout',
  'shine-outreach',
  'new-here-lunch'
);
