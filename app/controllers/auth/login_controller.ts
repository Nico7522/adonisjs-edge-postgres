import UserService from '#services/user_service'
import { emailValidator, loginValidator, resetPasswordValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { LoginForm } from '../../forms/login-form.js'
import { inject } from '@adonisjs/core'
import EmailService from '#services/email_service'
import Helper from '../../helpers/helper.js'
@inject()
export default class LoginController {
  constructor(
    private _userService: UserService,
    private _emailService: EmailService
  ) {}
  async show({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async store({ request, response, auth, session }: HttpContext) {
    const data = await request.validateUsing(loginValidator)
    const user = await UserService.login(data as LoginForm)

    if (user.isEmailVerified === false) {
      session.flash('accountUnconfirmed', 'Please confirm your account')
      return response.redirect().back()
    }
    await auth.use('web').login(user, data.isRememberMe)
    return response.redirect().toRoute('/')
  }

  async showForgotPasswordPage({ view }: HttpContext) {
    return view.render('pages/auth/email-form', {
      title: 'Forgot Password',
      targetRoute: 'auth.forgot-password.store',
    })
  }

  async sendForgotPasswordToken({ request, response, view, session }: HttpContext) {
    const data = await request.validateUsing(emailValidator)

    try {
      const user = await this._userService.GetByEmail(data.email)

      if (user)
        await this._emailService.sendToken(user, 'emails/reset_password_html', 'passwordResetToken')
      return view.render('pages/auth/email-sent', {
        title: 'Email Send',
        text: 'A email has been send to your email.',
      })
    } catch (error) {
      if (error.status === 404) {
        session.flash('error', 'User not found')
      } else {
        session.flash('error', 'Sorry, something went wrong')
      }
      return response.redirect().back()
    }
  }

  async showResetPasswordPage({ view, params }: HttpContext) {
    return view.render('pages/auth/reset-password', { token: params['token'] })
  }

  async resetPassword({ session, request, response, params }: HttpContext) {
    const data = await request.validateUsing(resetPasswordValidator)
    const token = params['token']
    try {
      await this._userService.changePassword(data.password, token)
      return response.redirect().toRoute('auth.login.show')
    } catch (error) {
      let message
      if (error.status === 404) {
        message = 'User not found'
      } else {
        message = 'Invalid token'
      }
      Helper.setFlashMessage(session, 'error', message)
      return response.redirect().back()
    }
  }
}
