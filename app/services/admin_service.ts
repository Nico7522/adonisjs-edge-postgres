import Actor from '#models/actor'
import Movie from '#models/movie'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class AdminService {
  async getMovieStats() {
    const moviesCount = await Movie.query().count('id').firstOrFail()
    const unreleased = await Movie.query()
      .where('releaseDate', '>', DateTime.now().toString())
      .count('id')
      .firstOrFail()

    const totalUsers = await User.query().count('id').firstOrFail()

    const totalActors = await Actor.query().count('id').firstOrFail()

    return { moviesCount, unreleased, totalUsers, totalActors }
  }
}
