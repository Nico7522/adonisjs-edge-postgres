import MovieService from '#services/movie_service'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

@inject()
export default class MoviesController {
  constructor(protected movieService: MovieService) {}

  async index({ request, view }: HttpContext) {
    const qs = request.qs()
    const sortOptions = this.movieService.moviesSortOptions
    const moviesVM = await this.movieService.getMovie(qs)
    return view.render('pages/movie/movies', { movies: moviesVM, sortOptions, filter: qs })
  }

  async show({ view, params }: HttpContext) {
    const movieDetailsVM = await this.movieService.getOne(params['slug'])

    return view.render('pages/movie/movie', { movie: movieDetailsVM })
  }

  async getComing({ view }: HttpContext) {
    const moviesVM = await this.movieService.getComing()
    return view.render('pages/movie/movies', { movies: moviesVM, title: 'Coming movies' })
  }

  async getMostRated({ view }: HttpContext) {
    const movieVM = await this.movieService.getMostRated()
    return view.render('pages/movie/movies', { movies: movieVM, title: 'Top movies' })
  }
}
