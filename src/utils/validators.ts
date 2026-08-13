import { z } from 'zod'

export const matchSchema = z.object({
  match_date: z.string().min(1, 'Match date is required'),
  opponent: z.string().min(2, 'Opponent must be at least 2 characters'),
  competition: z.string().min(2, 'Competition must be at least 2 characters'),
  competition_id: z.number().optional(),
  venue: z.string().min(2, 'Venue must be at least 2 characters'),
  attendance_type: z.enum(['in_person', 'watched'], {
    required_error: 'Please select attendance type',
  }),
  is_home: z.boolean().default(true),
  score_home: z.number().nullable().optional(),
  score_away: z.number().nullable().optional(),
  seat_section: z.string().optional().nullable(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional().nullable(),
  photo_url: z.string().optional().nullable(),
  miles_travelled: z.number().min(0, 'Miles cannot be negative').optional().nullable(),
  season: z.string().optional().nullable(),
  fixture_id: z.number().optional().nullable(),
}).refine(
  (data) => {
    // If one score is provided, both must be
    if (data.score_home !== null && data.score_home !== undefined) {
      return data.score_away !== null && data.score_away !== undefined
    }
    if (data.score_away !== null && data.score_away !== undefined) {
      return data.score_home !== null && data.score_home !== undefined
    }
    return true
  },
  {
    message: 'Both home and away scores must be provided together',
    path: ['score_home'],
  }
)

export type MatchFormData = z.infer<typeof matchSchema>
