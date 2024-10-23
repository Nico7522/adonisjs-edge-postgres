import UserService from '#services/user_service'
import { profileUpdateAvatarValidator, profileUpdateValidator } from '#validators/profile'
import { inject } from '@adonisjs/core'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { unlink } from 'fs/promises'
import Helper from '../helpers/helper.js'
@inject()
export default class ProfilesController {
  constructor(private _userService: UserService) {}
  async index({ view, auth }: HttpContext) {
    const user = await auth.user
    if (user) {
      await user.load('watchlist')
      await user.watchlist.load('movies')
    }

    let formatedBirthdate = user?.birthdate.toLocaleDateString()
    return view.render('pages/users/profile', { user, formatedBirthdate })
  }

  async edit({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(profileUpdateValidator)

    try {
      await this._userService.edit(auth.user!.id, data)
      response.redirect().back()
    } catch (error) {
      console.log(error)
      response.redirect().back()
    }
  }

  async updateAvatar({ request, response, auth, session }: HttpContext) {
    if (!request.file('avatar')) {
      Helper.setFlashMessage(session, 'error', 'You must chose a picture')

      response.redirect().back()
    }
    const { avatar } = await request.validateUsing(profileUpdateAvatarValidator)

    if (avatar) {
      if (auth.user?.avatar && auth.user?.avatar !== 'placeholder.png') {
        await unlink(app.makePath('storage/uploads/avatars', auth.user.avatar))
      }
      await avatar.move(app.makePath('storage/uploads/avatars'), {
        name: `${cuid()}.${avatar.extname}`,
      })
      auth.user!.avatar = avatar.fileName!
      await auth.user?.save()
      Helper.setFlashMessage(session, 'avatar', 'Avatar updated', undefined, false)
      response.redirect().back()
    }
  }
}
