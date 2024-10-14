import MovieService from '#services/movie_service'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Movie from '#models/movie'

@inject()
export default class HomeController {
  constructor(private _movieService: MovieService) {}

  async index({ view, auth }: HttpContext) {
    const lastReleasedMoviesVM = await this._movieService.getLast()
    const latestMovieAddedVM = await this._movieService.getLatestAdded()
    const mostWatchedMovieVM = await this._movieService.getMostWatched()
    const moviesToSuggestVM = await this._movieService.getMovieToSuggest(auth.user?.id)
    return view.render('pages/home', {
      lastReleasedMovies: lastReleasedMoviesVM,
      latestMovieAdded: latestMovieAddedVM,
      mostWatchedMovie: mostWatchedMovieVM,
      moviesToSuggest: moviesToSuggestVM,
    })
  }
}
