import Token from '#models/token'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class VerifyEmailsController {
  constructor(private _userService: UserService) {}
  async show({ view }: HttpContext) {
    return view.render('pages/auth/verify-email')
  }

  async verify({ params, view }: HttpContext) {
    const token = params['token']
    try {
      const isConfirmed = await this._userService.verifyEmail(token)
      return view.render('pages/auth/verify-email-token', { isConfirmed })
    } catch (error) {
      return view.render('pages/auth/verify-email-token', { isConfirmed: false })
    }
  }
}
