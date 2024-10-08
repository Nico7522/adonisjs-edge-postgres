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

@inject()
export default class MoviesController {
  sortOptions: MovieSortOptions[] = []
  constructor(protected movieService: MovieService) {
    this.sortOptions = this.movieService.moviesSortOptions
  }

  async index({ request, view }: HttpContext) {
    const page = request.input('page')
    const qs = request.qs()
    const { moviesVM, pagination } = await this.movieService.getMovie(page, qs)

    return view.render('pages/movie/movies', {
      moviesVM,
      pagination: pagination,
      sortOptions: this.sortOptions,
      filter: qs,
    })
  }

  async show({ view, params, auth }: HttpContext) {
    const userId = auth.user?.id
    const { movieDetailsVM, inWatchlist } = await this.movieService.getOne(params['slug'], userId)

    return view.render('pages/movie/movie', { movie: movieDetailsVM, inWatchlist })
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
    const moviesVM = await this.movieService.getMostRated()
    return view.render('pages/movie/movies', {
      movies: moviesVM,
      title: 'Top movies',
      sortOptions: this.sortOptions,
      filter: qs,
    })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/movie/create')
  }
  async store({ view, request, response }: HttpContext) {
    const data = await request.validateUsing(movieValidator)

    let newMovie = new Movie()

    newMovie.rating = data.rating ? data.rating : null
    newMovie.title = data.title
    newMovie.summary = data.summary
    newMovie.realisator = data.realisator
    newMovie.releaseDate = data.releaseDate ? DateTime.fromJSDate(data.releaseDate!) : null
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
      const createdMovie = await Movie.create(newMovie)
      return response.redirect().toRoute('movies.show', { slug: createdMovie.slug })
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
