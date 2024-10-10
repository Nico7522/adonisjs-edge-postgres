import { profileUpdateAvatarValidator } from '#validators/profile'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { unlink } from 'fs/promises'

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

  async updateAvatar({ request, response, auth, session }: HttpContext) {
    if (!request.file('avatar')) {
      session.flash('noPicture', 'You must chose a picture')

      response.redirect().back()
    }
    const { avatar } = await request.validateUsing(profileUpdateAvatarValidator)

    if (avatar) {
      if (auth.user?.avatar) {
        await unlink(app.makePath('storage/uploads', auth.user.avatar))
      }
      await avatar.move(app.makePath('storage/uploads'), {
        name: `${cuid()}.${avatar.extname}`,
      })
      auth.user!.avatar = avatar.fileName!
      await auth.user?.save()

      response.redirect().back()
    }
  }
}
