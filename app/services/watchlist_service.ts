import Watchlist from '#models/watchlist'

export default class WatchlistService {
  async toggle(userId: number, movieId: number) {
    const watchlist = await Watchlist.query()
      .preload('movies', (query) => {
        query.where('movie_id', movieId)
      })
      .where('user_id', userId)
      .first()

    if (watchlist) {
      if (watchlist.movies.length > 0) {
        await watchlist.related('movies').detach([movieId])
      } else {
        await watchlist.related('movies').attach([movieId])
      }
    }
  }
}
