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
      session.flash('success', 'Succefully toggled')
      response.redirect().back()
    } catch (error) {
      session.flash('error', 'Something wrong')
      response.redirect().back()
    }
  }

  async toggleWatched({ response, params, auth, session }: HttpContext) {
    const userId = auth.user!.id
    const { slug } = params

    try {
      await this._watchlistService.toggleWatched(userId, slug)
      session.flash('success', 'Movie updated !')
      response.redirect().back()
    } catch (error) {
      session.flash('error', 'Something wrong')
      console.log(error)
      response.redirect().back()
    }
  }
}
