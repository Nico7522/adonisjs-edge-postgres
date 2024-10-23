import { BaseModel, beforeCreate, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'
import Watchlist from './watchlist.js'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Actor from './actor.js'
import { MovieDetailsVM, MovieVM } from '#view_models/movie'
import Genre from './genre.js'
import MoviePicture from './movie_picture.js'
export default class Movie extends BaseModel {
  #setRatingStars(movie: Movie) {
    let rating = []
    if (movie.rating && movie.rating > 0) {
      let i = movie.rating
      while (i > 0) {
        rating.push({
          color: 'text-yellow-300',
        })
        i--
      }
      while (rating.length < 5) {
        rating.push({
          color: 'text-gray-500',
        })
      }
    }

    return rating
  }

  toMovieVM(movie: this): MovieVM {
    return {
      id: this.id,
      summary: this.summary,
      slug: this.slug,
      image: this.image,
      banner: this.banner,
      title: movie.title,
      ratingStars: this.#setRatingStars(movie),
    }
  }

  toMovieDetailsVM(movie: this): MovieDetailsVM {
    return {
      id: this.id,
      summary: this.summary,
      slug: this.slug,
      image: this.image,
      title: movie.title,
      banner: this.banner,
      shootingPictures: this.pictures?.map((p) => p.image),
      releaseDate: this.releaseDate
        ? new Date(this.releaseDate.toString()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      ratingStars: this.#setRatingStars(movie),
      actors: this.actors,
      genres: this.genres,
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
  declare rating: number | null

  @column()
  declare image: string | null

  @column()
  declare banner: string | null

  @column()
  declare releaseDate: DateTime | null

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

  @manyToMany(() => Genre, {
    pivotTable: 'genre_movies',
    pivotTimestamps: true,
  })
  declare genres: ManyToMany<typeof Genre>

  @hasMany(() => MoviePicture)
  declare pictures: HasMany<typeof MoviePicture>

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

  @beforeCreate()
  static async checkIfRatingCanBeSet(movie: Movie) {
    if (movie.rating && movie.releaseDate && movie.releaseDate > DateTime.now()) {
      throw new Error("Rating can't be set for a unreleased movie")
    }
  }
}
