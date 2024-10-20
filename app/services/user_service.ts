import Token from '#models/token'
import User from '#models/user'
import Watchlist from '#models/watchlist'
import { LoginForm } from '../forms/login-form.js'
import { RegisterForm } from '../forms/register-form.js'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class UserService {
  constructor() {}

  async GetByEmail(email: string) {
    const user = await User.findByOrFail('email', email)

    return user
  }

  async register(data: RegisterForm, trx: TransactionClientContract) {
    data.avatar = 'placeholder.png'
    const user = await User.create(data, { client: trx })

    if (user) {
      const userWatchlist = new Watchlist()
      userWatchlist.userId = user.id
      await Watchlist.create(userWatchlist, { client: trx })
    }
    return user
  }

  static async login({ email, password }: LoginForm) {
    const user = await User.verifyCredentials(email, password)

    return user
  }

  async edit(userId: number, data: Partial<User>) {
    const user = await User.findOrFail(userId)
    await user.merge(data)
    await user.save()
  }

  async verifyEmail(token: string) {
    const { isValid, userId } = await Token.verify(token, 'VERIFY_EMAIL')

    const user = await User.find(userId)

    if (isValid && user) {
      user.isEmailVerified = true
      user.save()
    }

    return isValid && user !== null
  }
}
