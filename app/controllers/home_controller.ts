import MovieService from '#services/movie_service'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import Movie from '#models/movie'

@inject()
export default class HomeController {
  constructor(protected movieService: MovieService) {}

  async index({ view }: HttpContext) {
    const moviesVM = await this.movieService.getLast()
    const movie = await Movie.query().where('id', moviesVM[2].id).first()
    console.log(movie)

    movie!.banner = 'avg-banner.jpg'
    await movie?.save()
    return view.render('pages/home', { movies: moviesVM })
  }
}
