import {z} from 'zod'

const optionalUrl = z
  .union([z.string().url(), z.literal('')])
  .optional()
  .transform((value) => (value ? value : null))

const optionalText = z
  .union([z.string(), z.literal('')])
  .optional()
  .transform((value) => (value ? value : null))

const isoDate = z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date')

export const adminEventSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens')
    .optional(),
  starts_at: isoDate,
  ends_at: isoDate.nullable().optional(),
  location: optionalText,
  summary: z.string().max(500).nullable().optional(),
  description: z.string().max(10000).nullable().optional(),
  image_url: optionalUrl,
  register_url: optionalUrl,
  capacity: z.number().int().positive().nullable().optional(),
  published: z.boolean().default(true),
})

export const adminEventUpdateSchema = adminEventSchema.partial().extend({
  title: z.string().min(1).max(200).optional(),
})

export type AdminEventInput = z.infer<typeof adminEventSchema>
