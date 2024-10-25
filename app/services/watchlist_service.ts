import Movie from '#models/movie'
import Watchlist from '#models/watchlist'

export default class WatchlistService {
  async get(watchlistId: number, qs: Record<string, any>) {
    let genre: string = qs.genre

    // Transform the first letter to uppercase
    if (genre) genre = genre.replace(/^./, genre[0].toUpperCase())

    const watchlist = await Watchlist.query().where('id', watchlistId).firstOrFail()
    await watchlist.load('movies', (query) => {
      query.if(qs.genre, (query) => {
        query.whereHas('genres', (query) => query.where('name', genre))
      })
      query.if(qs.watched, (query) => query.where('watched', qs.watched))
    })

    return watchlist
  }

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

  async toggleWatched(userId: number, slug: string) {
    const watchlist = await Watchlist.query()
      .where('user_id', userId)
      .preload('movies', (query) => query.where('slug', slug))
      .firstOrFail()

    await watchlist
      .related('movies')
      .pivotQuery()
      .wherePivot('movie_id', watchlist.movies[0].id)
      .update('watched', !watchlist.movies[0].$extras.pivot_watched)

    await watchlist.save()
  }
}
