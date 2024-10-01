import MovieService from '#services/movie_service'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

@inject()
export default class HomeController {
  constructor(protected movieService: MovieService) {}

  async index({ view }: HttpContext) {
    const moviesVM = await this.movieService.getLast()
    return view.render('pages/home', { movies: moviesVM })
  }
}
