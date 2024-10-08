import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async index({ view, auth }: HttpContext) {
    const user = await auth.user
    if (user) {
      await user.load('watchlist')
      await user.watchlist.load('movies')
    }

    let formatedBirthdate = user?.birthdate.toLocaleDateString()
    return view.render('pages/users/profile', { user, formatedBirthdate })
  }
}
