import vine, { VineNumber } from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

type Options = {
  releaseDate: Date
}
async function checkRating(value: unknown, options: Options, field: FieldContext) {
  if (typeof value !== 'number') {
    return
  }
  if (options.releaseDate < new Date()) {
    field.report("Can't set rating for this movie", 'checkRating', field)
  }
}

export const checkRatingRule = vine.createRule(checkRating)
declare module '@vinejs/vine' {
  interface VineNumber {
    checkRating(options: Options): this
  }
}
VineNumber.macro('checkRating', function (this: VineNumber, options: Options) {
  return this.use(checkRatingRule(options))
})
