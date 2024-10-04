import Movie from '#models/movie'
import Watchlist from '#models/watchlist'
import { MovieDetailsVM, MovieVM } from '#view_models/movie'
// @ts-ignore
import { MovieSortOptions } from '#types/movie_sort_options'

export default class MovieService {
  moviesSortOptions: MovieSortOptions[] = [
    {
      id: 'title_asc',
      text: 'Title (asc)',
      field: 'title',
      dir: 'asc',
    },
    {
      id: 'title_desc',
      text: 'Title (desc)',
      field: 'title',
      dir: 'desc',
    },
    {
      id: 'rating_asc',
      text: 'Rating (asc)',
      field: 'rating',
      dir: 'asc',
    },
    {
      id: 'rating_desc',
      text: 'Rating (desc)',
      field: 'rating',
      dir: 'desc',
    },
  ]
  async getMovie(qs: Record<string, any>) {
    if (qs.sort) {
      qs.sort = qs.sort.trim()
    }
    const sort = this.moviesSortOptions.find((o) => o.id == qs.sort) || this.moviesSortOptions[0]

    const movies = await Movie.query()
      .if(qs.search, (query) => {
        query.whereILike('title', `%${qs.search}%`)
      })
      .orderBy(sort.field, sort.dir)
    let moviesVM: MovieVM[] = this.#mapMovie(movies)
    return moviesVM
  }

  async getLast() {
    const lastMovie = await Movie.query().orderBy('release_date').limit(3)
    let moviesVM: MovieVM[] = this.#mapMovie(lastMovie)

    return moviesVM
  }

  async getOne(slug: string) {
    let movie = await Movie.query()
      .where('slug', slug)
      .preload('actors')
      .preload('genres')
      .firstOrFail()

    let movieDetailsVM: MovieDetailsVM = movie.toMovieDetailsVM(movie)
    return movieDetailsVM
  }

  static async setWatchedStatus() {
    const watchlist = await Watchlist.query().where('user_id', 1).firstOrFail()

    if (watchlist) {
      await watchlist.related('movies').pivotQuery().where('movie_id', 2).update({ watched: false })
    }
  }

  async getComing() {
    const movies = await Movie.query().where('release_date', '>', new Date())
    let moviesVM: MovieVM[] = this.#mapMovie(movies)

    return moviesVM
  }

  async getMostRated() {
    const movies = await Movie.query().where('rating', '>', 3).orderBy('rating', 'desc')
    let moviesVM: MovieVM[] = this.#mapMovie(movies)

    return moviesVM
  }

  #mapMovie(movies: Movie[]): MovieVM[] {
    let moviesVM: MovieVM[] = movies.map((movie) => {
      return movie.toMovieVM(movie)
    })

    return moviesVM
  }
}
