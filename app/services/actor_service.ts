import Actor from '#models/actor'

export default class ActorService {
  async getById(slug: string) {
    const actor = await Actor.findByOrFail('slug', slug)

    if (actor) {
      await actor.load('movies')
    }

    return actor
  }
}
