import Movie from '#models/movie'
import Watchlist from '#models/watchlist'
import { MovieDetailsVM, MovieVM } from '#view_models/movie'
export default class MovieService {
  async getMovie(qs: Record<string, any>) {
    const movies = await Movie.query().if(qs.search, (query) => {
      query.whereILike('title', `%${qs.search}%`)
    })
    let moviesVM: MovieVM[] = this.#mapMovie(movies)
    return moviesVM
  }

  async getLast() {
    const lastMovie = await Movie.query().orderBy('release_date').limit(3)
    let moviesVM: MovieVM[] = this.#mapMovie(lastMovie)

    return moviesVM
  }

  async getOne(slug: string) {
    let movie = await Movie.query().where('slug', slug).preload('actors').firstOrFail()

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
