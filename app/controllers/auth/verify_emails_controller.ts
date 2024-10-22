import EmailService from '#services/email_service'
import UserService from '#services/user_service'
import { emailValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Helper from '../../helpers/helper.js'

@inject()
export default class VerifyEmailsController {
  constructor(
    private _userService: UserService,
    private _emailService: EmailService
  ) {}

  // Show the verify email sent page.
  async show({ view }: HttpContext) {
    return view.render('pages/auth/email-sent', {
      title: 'Email Sent',
      text: 'A email has been send to your email adress',
    })
  }

  // Show the form to sent back a confirmation email.
  async showSentBackVerifyEmailTokenPage({ view }: HttpContext) {
    return view.render('pages/auth/email-form', {
      title: 'Email confirmation',
      targetRoute: 'auth.verify-email-sent-back.store',
    })
  }

  // Show the verify email sent page after sent back a confirmation email.
  async sentBackVerifyEmailToken({ request, view, response, session }: HttpContext) {
    const data = await request.validateUsing(emailValidator)

    try {
      const user = await this._userService.GetByEmail(data.email)

      if (user?.isEmailVerified) {
        session.flash('accountConfirmed', 'Account already confirmed')
        return response.redirect().back()
      }

      if (user)
        await this._emailService.sendToken(user, 'emails/verify_email_html', 'verifyEmailToken')
      return view.render('pages/auth/email-sent', {
        title: 'Email Send',
        text: 'A email has been send to your email.',
      })
    } catch (error) {
      let message
      if (error.status === 404) {
        message = 'User not found'
      } else {
        message = 'Something went wrong'
      }
      Helper.setFlashMessage(session, 'error', message)
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
