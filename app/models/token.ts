import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import stringHelpers from '@adonisjs/core/helpers/string'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime()
  declare updatedAt: DateTime

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column()
  declare token: string

  @column()
  declare type: string

  @column()
  declare userId: number | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  static async generateVerifyEmailToken(user: User) {
    const token = stringHelpers.generateRandom(64)

    await Token.expiresTokens(user, 'verifyEmailTokens')

    const record = await user.related('tokens').create({
      type: 'VERIFY_EMAIL',
      expiresAt: DateTime.now().plus({ hours: 3 }),
      token,
    })

    return record.token
  }

  static async generatePasswordToken(user: User) {
    const token = stringHelpers.generateRandom(64)

    await Token.expiresTokens(user, 'passwordResetTokens')

    const record = await user.related('tokens').create({
      type: 'PASSWORD_RESET',
      expiresAt: DateTime.now().plus({ hours: 3 }),
      token,
    })

    return record.token
  }

  static async getUserToken(token: string, type: 'VERIFY_EMAIL' | 'PASSWORD_RESET') {
    const record = await Token.query()
      .preload('user')
      .where('token', token)
      .where('type', type)
      .where('expiresAt', '>', DateTime.now().toSQL())
      .orderBy('createdAt', 'desc')
      .first()

    return record?.user
  }

  static async verify(token: string, type: 'VERIFY_EMAIL' | 'PASSWORD_RESET') {
    const record = await Token.query()
      .where('expiresAt', '>', DateTime.now().toSQL())
      .where('token', token)
      .where('type', type)
      .first()

    return !!record
  }

  static async expiresTokens(
    user: User,
    relationName: 'passwordResetTokens' | 'verifyEmailTokens'
  ) {
    await user.related(relationName).query().update({
      expiresAt: DateTime.now(),
    })
  }
}
