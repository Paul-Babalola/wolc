export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          slug: string
          title: string
          starts_at: string
          ends_at: string | null
          location: string | null
          summary: string | null
          description: string | null
          image_url: string | null
          register_url: string | null
          capacity: number | null
          published: boolean
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      rsvps: {Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>}
      prayer_requests: {Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>}
      contact_messages: {Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>}
      newsletter_subscribers: {Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>}
    }
  }
}
