import ActorService from '#services/actor_service'
import { inject } from '@adonisjs/core'

import type { HttpContext } from '@adonisjs/core/http'
@inject()
export default class ActorsController {
  constructor(private _actorService: ActorService) {}

  async show({ view, params }: HttpContext) {
    const actor = await this._actorService.getById(params['slug'])

    return view.render('pages/actors/actor', { actor })
  }
}
