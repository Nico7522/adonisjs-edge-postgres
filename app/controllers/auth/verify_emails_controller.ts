import Token from '#models/token'
import type { HttpContext } from '@adonisjs/core/http'

export default class VerifyEmailsController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/verify-email')
  }

  async verify({ params, view }: HttpContext) {
    const token = params['token']

    const isConfirmed = await Token.verify(token, 'VERIFY_EMAIL')
    console.log(isConfirmed)

    return view.render('pages/auth/verify-email-token', { isConfirmed })
  }
}
