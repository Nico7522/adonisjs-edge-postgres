import { passwordMatchRule } from '#start/rules/password_matching'
import vine from '@vinejs/vine'
import { table } from 'console'

export const registerValidator = vine.compile(
  vine.object({
    firstname: vine.string(),
    lastname: vine.string(),
    email: vine.string().email().normalizeEmail().isUnique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8),
    birthdate: vine.date(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8),
    isRememberMe: vine.accepted().optional(),
  })
)

export const emailValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    password: vine.string().minLength(8),
    passwordConfirm: vine
      .string()
      .use(passwordMatchRule({ table: '', column: '' }))
      .minLength(8),
  })
)
