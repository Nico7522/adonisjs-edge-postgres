import UserService from '#services/user_service'
import type { HttpContext } from '@adonisjs/core/http'
import { RegisterForm } from '../../forms/register-form.js'
import { registerValidator } from '#validators/auth'

export default class RegisterController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await UserService.register(data as RegisterForm)

    await auth.use('web').login(user)

    return response.redirect().toRoute('home')
  }
}
