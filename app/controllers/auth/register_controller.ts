import UserService from '#services/user_service'
import type { HttpContext } from '@adonisjs/core/http'
import { RegisterForm } from '../../forms/register-form.js'
import { registerValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import EmailService from '#services/email_service'
import db from '@adonisjs/lucid/services/db'
import Token from '#models/token'

@inject()
export default class RegisterController {
  constructor(
    private _userService: UserService,
    private _emailService: EmailService
  ) {}
  async show({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const trx = await db.transaction()
    try {
      const user = await this._userService.register(data as RegisterForm, trx)
      await this._emailService.sendVerifyEmail(user)

      trx.commit()
      return response.redirect().toRoute('auth.email-sent.show')
    } catch (error) {
      trx.rollback()
      session.flash('error', 'Something went wrong during the process, please try later')
      return response.redirect().toRoute('auth.register.show')
    }
  }
}
