import WatchlistService from '#services/watchlist_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class WatchlistsController {
  constructor(private _watchlistService: WatchlistService) {}
  async index({}: HttpContext) {}

  async toggle({ response, params, auth, session }: HttpContext) {
    const userId = auth.user!.id
    const { slug } = params
    try {
      await this._watchlistService.toggle(userId, slug)
      session.flash('success', {
        type: 'added',
        message: 'Succefully toggled',
      })
      response.redirect().back()
    } catch (error) {
      console.log(error)

      session.flash('alert', {
        type: 'error',
        message: 'Something wrong, try later',
      })
      response.redirect().back()
    }
  }
}
