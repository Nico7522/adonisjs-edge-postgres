import UserService from '#services/user_service'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { LoginForm } from '../../forms/login-form.js'

export default class LoginController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async store({ request, response, auth, session }: HttpContext) {
    const data = await request.validateUsing(loginValidator)
    const user = await UserService.login(data as LoginForm)

    if (user.isEmailVerified === false) {
      console.log(user.isEmailVerified)
      session.flash('accountUnconfirmed', 'Please confirm your account')
      return response.redirect().back()
    }
    await auth.use('web').login(user, data.isRememberMe)
    return response.redirect().toRoute('/')
  }
}
