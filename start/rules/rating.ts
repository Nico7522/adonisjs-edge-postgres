import vine, { VineNumber } from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'
import { DateTime } from 'luxon'

type Options = {
  table: string
  column: string
}
async function checkRating(value: unknown, _options: Options, field: FieldContext) {
  let movieDate = field.parent.releaseDate
    ? DateTime.fromJSDate(new Date(field.parent.releaseDate))
    : null

  if (typeof value !== 'number') {
    return
  }

  if (!movieDate || movieDate > DateTime.now()) {
    field.report("Can't set rating for this movie", 'rating', field)
  }
}
export const checkRatingRule = vine.createRule(checkRating)

// // Ajoute la méthode checkRating à VineNumber via un macro
// declare module '@vinejs/vine' {
//   interface VineNumber {
//     checkRating(options: Options): this
//   }
// }

// // Définition du macro
// VineNumber.macro('checkRating', function (this: VineNumber, options: Options) {
//   return this.use(checkRatingRule(options))
// })
