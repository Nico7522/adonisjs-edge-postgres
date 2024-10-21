import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

type Options = {
  table: string
  column: string
}
async function passwordMatch(value: unknown, _options: Options, field: FieldContext) {
  console.log(value)

  if (typeof value !== 'string') {
    return
  }

  if (value !== field.parent.password) {
    field.report('Password not match', 'passwordNotMatch', field)
  }
}

export const passwordMatchRule = vine.createRule(passwordMatch)
