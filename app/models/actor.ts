import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'

import { BaseModel, beforeCreate, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Movie from './movie.js'

export default class Actor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstname: string

  @column()
  declare lastname: string

  @column()
  declare slug: string

  @column()
  declare image: string | null

  @column()
  declare birthdate: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Movie, {
    pivotTable: 'movie_actors',
    pivotTimestamps: true,
  })
  declare movies: ManyToMany<typeof Movie>

  @beforeCreate()
  static async slugify(actor: Actor) {
    if (actor.slug) return

    const slug = string.slug(actor.firstname + ' ' + actor.lastname, {
      replacement: '-',
      lower: true,
      strict: true,
    })

    const rows = await Movie.query()
      .select('slug')
      .whereRaw('lower(??) = ?', ['slug', slug])
      .orWhereRaw('lower(??) like ?', ['slug', `${slug}-%`])

    if (!rows.length) {
      actor.slug = slug
      return
    }

    const incrementors = rows.reduce<number[]>((result, row) => {
      const tokens = row.slug.toLowerCase().split(`${slug}-`)

      if (tokens.length < 2) {
        return result
      }

      const increment = Number(tokens.at(1))

      if (!Number.isNaN(increment)) {
        result.push(increment)
      }

      return result
    }, [])

    const increment = incrementors.length ? Math.max(...incrementors) + 1 : 1

    actor.slug = `${slug}-${increment}`
  }
}
