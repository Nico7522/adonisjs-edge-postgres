import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Movie from './movie.js'

export default class Watchlist extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Movie, {
    pivotTable: 'watchlist_movies',
    pivotTimestamps: true,
    pivotColumns: ['watched'],
  })
  declare movies: ManyToMany<typeof Movie>
}
