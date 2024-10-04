import { UserFactory } from '#database/factories/user_factory'
import Roles from '#enums/role'
import Actor from '#models/actor'
import Genre from '#models/genre'
import Movie from '#models/movie'
import Role from '#models/role'
import Watchlist from '#models/watchlist'

import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  static environment = ['development']
  async run() {
    // Write your database queries inside the run method

    await Role.createMany([
      {
        id: Roles.USER,
        name: 'User',
      },
      {
        id: Roles.ADMIN,
        name: 'Administrator',
      },
    ])

    const actors = await Actor.createMany([
      {
        firstname: 'Henry',
        lastname: 'Cavill',
      },
      {
        firstname: 'Nicolas',
        lastname: 'Cage',
      },
      {
        firstname: 'Christian',
        lastname: 'Bale',
      },
      {
        firstname: 'Kevin',
        lastname: 'Conroy',
      },
      {
        firstname: 'Andrew',
        lastname: 'Garfield',
      },
      {
        firstname: 'Tom',
        lastname: 'Holland',
      },
    ])
    const movies = await Movie.createMany([
      {
        title: 'Superman',
        realisator: 'Richard Donner',
        rating: null,
        releaseDate: DateTime.fromISO('2025-07-11'),
        summary:
          "Juste avant l'explosion de la planète Krypton, Jor-El décide de sauver son fils en l'envoyant sur Terre. Le nourrisson est recueilli par le couple Kent qui décide de l'élever comme leur propre fils. L'enfant se met à développer des pouvoirs hors du commun. Une fois adulte, Clark Kent, journaliste au Daily Planet, souhaite mener une vie normale. Il ne renie pas pour autant ses capacités à sauver le monde et devient alors Superman.",
      },
      {
        title: 'Spiderman',
        rating: 4,
        realisator: 'Sam Raimi',
        releaseDate: DateTime.fromISO('2002-06-26'),
        summary:
          "Avec l'identité de Spiderman désormais révélée, celui-ci est démasqué et n'est plus en mesure de séparer sa vie normale en tant que Peter Parker des enjeux élevés d'être un superhéros.",
      },
      {
        title: 'Batman',
        rating: 3,
        realisator: 'Matt Reeves',
        releaseDate: DateTime.fromISO('2022-03-22'),
        summary:
          "Dans sa deuxième année de lutte contre le crime, Batman explore la corruption à Gotham et enquête sur les meurtres d'un tueur en série appelé le Sphinx.",
      },
      {
        title: 'Iron Man',
        rating: 5,
        realisator: 'Jon Favreau',
        releaseDate: DateTime.fromISO('2008-04-30'),
        summary:
          'Tony Stark crée une armure sophistiquée pour échapper à des terroristes et devient Iron Man, un héros destiné à protéger le monde.',
      },
      {
        title: 'Thor',
        rating: 4,
        realisator: 'Kenneth Branagh',
        releaseDate: DateTime.fromISO('2011-05-06'),
        summary:
          "Banni d'Asgard, Thor doit vivre sur Terre et apprendre l'humilité pour retrouver ses pouvoirs et protéger son royaume d'une menace.",
      },
      {
        title: 'The Avengers',
        rating: 5,
        realisator: 'Joss Whedon',
        releaseDate: DateTime.fromISO('2012-04-25'),
        summary:
          "L'équipe des Avengers est formée pour défendre la Terre contre Loki et son armée extraterrestre.",
      },
      {
        title: 'Inception',
        rating: 5,
        realisator: 'Christopher Nolan',
        releaseDate: DateTime.fromISO('2010-07-16'),
        summary:
          "Un voleur expérimenté dans l'art de l'extraction, entre dans les rêves pour voler des idées et est chargé d'implanter une idée dans l'esprit d'un héritier.",
      },
      {
        title: 'The Matrix',
        rating: 5,
        realisator: 'Lana Wachowski, Lilly Wachowski',
        releaseDate: DateTime.fromISO('1999-03-31'),
        summary:
          "Un hacker découvre que la réalité est une simulation créée par des machines et qu'il est l'Élu destiné à sauver l'humanité.",
      },
      {
        title: 'Interstellar',
        rating: 4,
        realisator: 'Christopher Nolan',
        releaseDate: DateTime.fromISO('2014-11-07'),
        summary:
          "Des explorateurs voyagent à travers un trou de ver dans l'espace dans le but de trouver un nouvel habitat pour l'humanité.",
      },
      {
        title: 'The Godfather',
        rating: 5,
        realisator: 'Francis Ford Coppola',
        releaseDate: DateTime.fromISO('1972-03-24'),
        summary:
          "L'histoire de la famille Corleone, une des familles les plus puissantes de la mafia italo-américaine.",
      },
      {
        title: 'Pulp Fiction',
        rating: 5,
        realisator: 'Quentin Tarantino',
        releaseDate: DateTime.fromISO('1994-10-14'),
        summary:
          'Des histoires entrecroisées de crime et de rédemption dans le Los Angeles des années 90.',
      },
      {
        title: 'Fight Club',
        rating: 4,
        realisator: 'David Fincher',
        releaseDate: DateTime.fromISO('1999-10-15'),
        summary:
          'Un homme désabusé rencontre un vendeur de savon mystérieux et fonde un club de combat souterrain.',
      },
      {
        title: 'The Shawshank Redemption',
        rating: 5,
        realisator: 'Frank Darabont',
        releaseDate: DateTime.fromISO('1994-09-23'),
        summary:
          "L'histoire d'un homme emprisonné à tort qui se lie d'amitié avec un autre détenu tout en préparant son évasion.",
      },
      {
        title: 'Forrest Gump',
        rating: 5,
        realisator: 'Robert Zemeckis',
        releaseDate: DateTime.fromISO('1994-07-06'),
        summary:
          "Forrest Gump, un homme simple au grand cœur, raconte l'histoire de sa vie extraordinaire.",
      },
      {
        title: 'Gladiator',
        rating: 4,
        realisator: 'Ridley Scott',
        releaseDate: DateTime.fromISO('2000-05-01'),
        summary:
          "Un général romain trahi devient gladiateur et cherche à se venger de l'empereur corrompu.",
      },
      {
        title: 'The Dark Knight',
        rating: 5,
        realisator: 'Christopher Nolan',
        releaseDate: DateTime.fromISO('2008-07-18'),
        summary:
          'Batman affronte son plus grand ennemi, le Joker, qui sème le chaos dans Gotham City.',
      },
      {
        title: 'Jaws',
        rating: 4,
        realisator: 'Steven Spielberg',
        releaseDate: DateTime.fromISO('1975-06-20'),
        summary:
          "Un grand requin blanc terrorise une petite station balnéaire, et un groupe d'hommes tente de l'arrêter.",
      },
      {
        title: "Schindler's List",
        rating: 5,
        realisator: 'Steven Spielberg',
        releaseDate: DateTime.fromISO('1993-12-15'),
        summary:
          "L'histoire vraie d'Oskar Schindler, un industriel allemand qui sauva plus d'un millier de Juifs pendant la Shoah.",
      },
      {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        rating: 5,
        realisator: 'Peter Jackson',
        releaseDate: DateTime.fromISO('2001-12-19'),
        summary:
          'Un jeune Hobbit entreprend un voyage pour détruire un anneau puissant et maléfique.',
      },
      {
        title: 'Star Wars: A New Hope',
        rating: 5,
        realisator: 'George Lucas',
        releaseDate: DateTime.fromISO('1977-05-25'),
        summary:
          "Luke Skywalker rejoint une rébellion pour affronter l'Empire Galactique et restaurer la paix dans la galaxie.",
      },
    ])

    const genres = await Genre.createMany([
      {
        name: 'Horror',
      },
      {
        name: 'Crime',
      },
      {
        name: 'Drama',
      },
      {
        name: 'Action',
      },
      {
        name: 'Thriller',
      },
      {
        name: 'Adventure',
      },
      {
        name: 'Fantasy',
      },
    ])

    await UserFactory.createMany(5)
    const watchlists = await Watchlist.createMany([
      {
        userId: 1,
      },
      {
        userId: 2,
      },
      {
        userId: 3,
      },
      {
        userId: 4,
      },
      {
        userId: 5,
      },
    ])
    await this.#attachActors(actors, movies)
    await this.#attachMovies(watchlists, movies)
    await this.#attachGenres(genres, movies)
  }

  async #attachMovies(watchlists: Watchlist[], movies: Movie[]) {
    const movieIds = await this.#getId(movies)

    for (const wl of watchlists) {
      await wl.related('movies').attach(movieIds)
    }
  }
  async #attachActors(actors: Actor[], movies: Movie[]) {
    const actorIds = await this.#getId(actors)
    for (const movie of movies) {
      await movie.related('actors').attach(actorIds)
    }
  }

  async #attachGenres(genres: Genre[], movies: Movie[]) {
    const genreIds = await this.#getId(genres)
    for (const movie of movies) {
      const min = this.#getRandomNumber(Math.random(), genreIds.length)
      const randomGenreIds = genreIds.slice(min, this.#getRandomNumber(min, genreIds.length))

      await movie.related('genres').attach(randomGenreIds)
    }
  }

  async #getId<T extends { id: number }>(array: T[]): Promise<number[]> {
    const ids = array.map(({ id }) => id)
    return ids
  }

  #getRandomNumber(min: number, max: number): number {
    return Math.floor(min * max)
  }
}
