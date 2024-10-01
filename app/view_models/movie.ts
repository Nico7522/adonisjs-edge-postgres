import Actor from '#models/actor'
import Movie from '#models/movie'

export type MovieVM = {
  type?: 'ViewModel'
  ratingStars?: string
  id: number
  summary: string
  slug: string
  image: string | null
  title: string
}

export type MovieDetailsVM = MovieVM & {
  actors: Actor[]
  realisator: string
  releaseDate: string
}
