import Movie from '#models/movie'

export type MovieSortOptions = {
  id: string
  text: string
  field: keyof Movie
  dir: 'asc' | 'desc' | undefined
}
