import WatchlistService from '#services/watchlist_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Helper from '../helpers/helper.js'

@inject()
export default class WatchlistsController {
  constructor(private _watchlistService: WatchlistService) {}
  async index({ view, auth, request }: HttpContext) {
    const qs = request.qs()

    await auth.user?.load('watchlist')
    const watchlistId = auth.user!.watchlist.id
    const watchlist = await this._watchlistService.get(watchlistId, qs)
    return view.render('pages/watchlist/watchlist', { watchlist })
  }

  async toggle({ response, params, auth, session }: HttpContext) {
    const userId = auth.user!.id
    const { slug } = params

    try {
      await this._watchlistService.toggle(userId, slug)
      Helper.setFlashMessage(session, 'success', 'Movie toggled !', undefined, false)
      response.redirect().back()
    } catch (error) {
      Helper.setFlashMessage(session, 'error', 'Something went wrong')
      response.redirect().back()
    }
  }

  async toggleWatched({ response, params, auth, session }: HttpContext) {
    const userId = auth.user!.id
    const { slug } = params

    try {
      await this._watchlistService.toggleWatched(userId, slug)
      Helper.setFlashMessage(session, 'success', 'Updated !', undefined, false)
      response.redirect().back()
    } catch (error) {
      Helper.setFlashMessage(session, 'error', 'Something went wrong')
      response.redirect().back()
    }
  }
}
