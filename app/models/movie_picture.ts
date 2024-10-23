import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Movie from './movie.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class MoviePicture extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare image: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare movieId: number

  @belongsTo(() => Movie)
  declare movie: BelongsTo<typeof Movie>
}
