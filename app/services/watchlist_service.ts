import Movie from '#models/movie'
import Watchlist from '#models/watchlist'

export default class WatchlistService {
  async toggle(userId: number, slug: string) {
    const movie = await Movie.query().where('slug', slug).firstOrFail()
    const watchlist = await Watchlist.query()
      .preload('movies', (query) => {
        query.where('slug', slug)
      })
      .where('user_id', userId)
      .first()

    if (watchlist) {
      if (watchlist.movies.length > 0) {
        await watchlist.related('movies').detach([movie.id])
      } else {
        await watchlist.related('movies').attach([movie.id])
      }
    }
  }
}
