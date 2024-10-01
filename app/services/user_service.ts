import User from '#models/user'
import { LoginForm } from '../forms/login-form.js'
import { RegisterForm } from '../forms/register-form.js'

export default class UserService {
  static async register(data: RegisterForm): Promise<User> {
    return await User.create(data)
  }

  static async login({ email, password }: LoginForm) {
    const user = await User.verifyCredentials(email, password)

    return user
  }
}
