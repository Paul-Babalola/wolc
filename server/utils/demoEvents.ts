/** Placeholder seed events — not shown on the public calendar. */
export const DEMO_EVENT_SLUGS = new Set([
  'encounter-night',
  'young-adults-hangout',
  'shine-outreach',
  'new-here-lunch',
])

export function isDemoEventSlug(slug: string) {
  return DEMO_EVENT_SLUGS.has(slug)
}
