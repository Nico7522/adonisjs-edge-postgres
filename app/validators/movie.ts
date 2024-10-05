import { checkRatingRule } from '#start/rules/rating'
import vine from '@vinejs/vine'

export const movieValidator = vine.compile(
  vine.object({
    title: vine.string(),
    releaseDate: vine.date().optional(),
    summary: vine.string(),
    rating: vine
      .number()
      .min(1)
      .max(5)
      .use(checkRatingRule({ table: 'movies', column: 'rating' }))
      .optional(),
    realisator: vine.string(),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'pdf'],
      })
      .optional(),
  })
)
