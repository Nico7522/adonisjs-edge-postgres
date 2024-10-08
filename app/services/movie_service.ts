import Movie from '#models/movie'
import Watchlist from '#models/watchlist'
import { MovieDetailsVM, MovieVM, Pagination } from '#view_models/movie'
// @ts-ignore
import { MovieSortOptions } from '#types/movie_sort_options'
import router from '@adonisjs/core/services/router'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
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
  async getMovie(page: number = 1, qs: Record<string, any>) {
    if (qs.sort) {
      qs.sort = qs.sort.trim()
    }
    const sort = this.moviesSortOptions.find((o) => o.id == qs.sort) || this.moviesSortOptions[0]

    const movies = await Movie.query()
      .if(qs.search, (query) => {
        query.whereILike('title', `%${qs.search}%`)
      })
      .orderBy(sort.field, sort.dir)
      .paginate(page, 5)

    movies.baseUrl(router.makeUrl('movies.index'))
    movies.queryString(qs)
    const rangeMin = movies.currentPage - 3
    const rangeMax = movies.currentPage + 3
    let pagination = movies.getUrlsForRange(1, movies.lastPage).filter((item) => {
      return item.page >= rangeMin && item.page <= rangeMax
    })

    let moviesVM: Pagination = this.#mapMovieWithPagination(movies)
    moviesVM.baseUrl(router.makeUrl('movies.index'))

    return { moviesVM, pagination }
  }

  async getLast() {
    const lastMovie = await Movie.query().orderBy('release_date').limit(3)
    let moviesVM: MovieVM[] = this.#mapMovie(lastMovie)

    return moviesVM
  }

  async getOne(slug: string, userId: number | undefined) {
    let movie = await Movie.query()
      .where('slug', slug)
      .preload('actors')
      .preload('genres')

      .if(userId !== undefined, (query) => {
        query.preload('watchlists', (query) => {
          query.where('user_id', userId!)
        })
      })
      .firstOrFail()

    let movieDetailsVM: MovieDetailsVM = movie.toMovieDetailsVM(movie)

    return { movieDetailsVM, inWatchlist: movie.watchlists ? movie.watchlists.length > 0 : false }
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

  #mapMovie(movies: Movie[]) {
    let moviesVM: MovieVM[] = movies.map((movie) => {
      return movie.toMovieVM(movie)
    })

    return moviesVM
  }

  #mapMovieWithPagination(movies: ModelPaginatorContract<Movie>): Pagination {
    let moviesVM: MovieVM[] = movies.map((movie) => {
      return movie.toMovieVM(movie)
    })

    let nextPageUrl = movies.getNextPageUrl()
    return {
      movies: moviesVM,
      getUrl: movies.getUrl,
      getPreviousPageUrl: movies.getPreviousPageUrl,
      baseUrl: movies.baseUrl,
      nextPageUrl,
      firstPage: movies.firstPage,
      lastPage: movies.lastPage,
      currentPage: movies.currentPage,
      hasPages: movies.hasPages,
    }
  }
}
