import { FieldContext } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'
import vine, { VineNumber, VineString } from '@vinejs/vine'
type Options = {
  table: string
  column: string
}
async function isUnique(value: unknown, options: Options, field: FieldContext) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return
  }
  const result = await db
    .from(options.table)
    .select(options.column)
    .where(options.column, value)
    .first()

  if (result) {
    field.report('This {{field}} is already taken', 'isUnique', field)
  }
}

export const isUniqueRule = vine.createRule(isUnique)

declare module '@vinejs/vine' {
  interface VineString {
    isUnique(options: Options): this
    hello(): void
  }
  interface VineNumber {
    isUnique(options: Options): this
  }
}
VineString.macro('isUnique', function (this: VineString, options: Options) {
  return this.use(isUniqueRule(options))
})

VineNumber.macro('isUnique', function (this: VineNumber, options: Options) {
  return this.use(isUniqueRule(options))
})
