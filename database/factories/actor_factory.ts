import factory from '@adonisjs/lucid/factories'
import Actor from '#models/actor'

export const ActorFactory = factory
  .define(Actor, async ({ faker }) => {
    return {}
  })
  .build()