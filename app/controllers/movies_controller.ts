import MovieService from '#services/movie_service'
import { type HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
// @ts-ignore
import MovieSortOptions from '#types/movie_sort_options'
import app from '@adonisjs/core/services/app'
import Movie from '#models/movie'
import { cuid } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'
import { movieValidator } from '#validators/movie'
import { errors } from '@vinejs/vine'

@inject()
export default class MoviesController {
  sortOptions: MovieSortOptions[] = []
  constructor(protected movieService: MovieService) {
    this.sortOptions = this.movieService.moviesSortOptions
  }

  async index({ request, view }: HttpContext) {
    const qs = request.qs()
    const moviesVM = await this.movieService.getMovie(qs)
    return view.render('pages/movie/movies', {
      movies: moviesVM,
      sortOptions: this.sortOptions,
      filter: qs,
    })
  }

  async show({ view, params }: HttpContext) {
    const movieDetailsVM = await this.movieService.getOne(params['slug'])

    return view.render('pages/movie/movie', { movie: movieDetailsVM })
  }

  async getComing({ request, view }: HttpContext) {
    const qs = request.qs()

    const moviesVM = await this.movieService.getComing()
    return view.render('pages/movie/movies', {
      movies: moviesVM,
      title: 'Coming movies',
      sortOptions: this.sortOptions,
      filter: qs,
    })
  }

  async getMostRated({ request, view }: HttpContext) {
    const qs = request.qs()
    const movieVM = await this.movieService.getMostRated()
    return view.render('pages/movie/movies', {
      movies: movieVM,
      title: 'Top movies',
      sortOptions: this.sortOptions,
      filter: qs,
    })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/movie/create')
  }
  async store({ view, request }: HttpContext) {
    const data = await request.validateUsing(movieValidator)

    let newMovie = new Movie()

    newMovie.rating = data.rating ? data.rating : null
    newMovie.title = data.title
    newMovie.summary = data.summary
    newMovie.realisator = data.realisator
    newMovie.releaseDate = DateTime.fromJSDate(data.releaseDate!)
    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (image) {
      await image.move(app.makePath('storage/uploads'), {
        name: `${cuid()}.${image.extname}`,
      })
      newMovie.image = image.fileName!
    }
    try {
      await Movie.create(newMovie)
      return view.render('pages/movie/create')
    } catch (error) {
      return view.render('pages/movie/create')
    }
  }
}
// const movies = await Movie.query()
// .preload('actors')
// .where('movies.id', 1)
// .join('movie_actors', 'movies.id', 'movie_actors.movie_id')
// .join('actors', 'movie_actors.actor_id', 'actors.id')
// .select('movies.*', 'actors.firstname')
