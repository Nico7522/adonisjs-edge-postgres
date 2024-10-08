import Actor from '#models/actor'
import Genre from '#models/genre'
import Movie from '#models/movie'
import { SimplePaginatorContract } from '@adonisjs/lucid/types/querybuilder'

export type MovieVM = {
  type?: 'ViewModel'
  ratingStars?: { color: string }[]
  id: number
  summary: string
  slug: string
  image: string | null
  title: string
}

export type MovieDetailsVM = MovieVM & {
  actors: Actor[]
  realisator: string
  releaseDate: string | null
  genres: Genre[]
}

export type Pagination = {
  movies: MovieVM[]
  getUrl: (page: number) => string
  getPreviousPageUrl: () => string | null
  baseUrl: (url: string) => SimplePaginatorContract<Movie>
  nextPageUrl: string | null
  firstPage: number
  lastPage: number
  currentPage: number
  hasPages: boolean
}
