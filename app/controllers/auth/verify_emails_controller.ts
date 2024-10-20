import EmailService from '#services/email_service'
import UserService from '#services/user_service'
import { verifyEmailValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class VerifyEmailsController {
  constructor(
    private _userService: UserService,
    private _emailService: EmailService
  ) {}

  // Show the verify email sent page.
  async show({ view }: HttpContext) {
    return view.render('pages/auth/verify-email')
  }

  // Show the form to sent back a confirmation email.
  async showResendVerifyEmailToken({ view }: HttpContext) {
    return view.render('pages/auth/verify-email-token-resend')
  }

  // Show the verify email sent page after sent back a confirmation email.
  async resendVerifyEmailToken({ request, view, response, session }: HttpContext) {
    const data = await request.validateUsing(verifyEmailValidator)

    try {
      const user = await this._userService.GetByEmail(data.email)

      if (user?.isEmailVerified) {
        session.flash('accountConfirmed', 'Account already confirmed')
        return response.redirect().back()
      }

      if (user) await this._emailService.sendVerifyEmail(user)
      return view.render('pages/auth/verify-email')
    } catch (error) {
      if (error.status === 404) {
        session.flash('error', 'User not found')
      } else {
        session.flash('error', 'Sorry, something went wrong')
      }
      return response.redirect().back()
    }
  }

  // Confirm or not the account.
  async verify({ params, view }: HttpContext) {
    const token = params['token']
    try {
      const isConfirmed = await this._userService.verifyEmail(token)
      return view.render('pages/auth/verify-email-token', { isConfirmed, token })
    } catch (error) {
      return view.render('pages/auth/verify-email-token', { isConfirmed: false, token })
    }
  }
}
