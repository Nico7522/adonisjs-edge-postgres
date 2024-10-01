import { BaseModel, beforeCreate, column, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'
import Watchlist from './watchlist.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Actor from './actor.js'
import { MovieDetailsVM, MovieVM } from '#view_models/movie'
export default class Movie extends BaseModel {
  #setRatingStars(movie: Movie) {
    let ratingStars = ''
    if (movie.rating > 0) {
      let i = movie.rating
      while (i > 0) {
        ratingStars += '★'
        i--
      }
    }

    return ratingStars
  }
  toMovieVM(movie: this): MovieVM {
    return {
      ...this,
      id: this.id,
      summary: this.summary,
      slug: this.slug,
      rating: this.rating,
      image: this.image,
      title: movie.title,
      ratingStars: this.#setRatingStars(movie),
    }
  }

  toMovieDetailsVM(movie: this): MovieDetailsVM {
    return {
      ...this,
      id: this.id,
      summary: this.summary,
      slug: this.slug,
      rating: this.rating,
      image: this.image,
      title: movie.title,
      releaseDate: new Date(this.releaseDate.toString()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      ratingStars: this.#setRatingStars(movie),
      actors: this.actors,
      realisator: this.realisator,
    }
  }
  @column()
  declare id: number

  @column()
  declare title: string

  @column()
  declare summary: string

  @column()
  declare rating: number

  @column()
  declare image: string | null

  @column()
  declare releaseDate: DateTime

  @column()
  declare realisator: string

  @column()
  declare slug: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Watchlist, {
    pivotTable: 'watchlist_movies',
    pivotTimestamps: true,
    pivotColumns: ['watched'],
  })
  declare watchlists: ManyToMany<typeof Watchlist>

  @manyToMany(() => Actor, {
    pivotTable: 'movie_actors',
    pivotTimestamps: true,
  })
  declare actors: ManyToMany<typeof Actor>

  @beforeCreate()
  static async slugify(movie: Movie) {
    if (movie.slug) return

    const slug = string.slug(movie.title, {
      replacement: '-',
      lower: true,
      strict: true,
    })

    const rows = await Movie.query()
      .select('slug')
      .whereRaw('lower(??) = ?', ['slug', slug])
      .orWhereRaw('lower(??) like ?', ['slug', `${slug}-%`])

    if (!rows.length) {
      movie.slug = slug
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

    movie.slug = `${slug}-${increment}`
  }
}
