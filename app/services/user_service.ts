import User from '#models/user'
import Watchlist from '#models/watchlist'
import { LoginForm } from '../forms/login-form.js'
import { RegisterForm } from '../forms/register-form.js'

export default class UserService {
  static async register(data: RegisterForm) {
    data.avatar = 'placeholder.png'
    const user = await User.create(data)

    if (user) {
      const userWatchlist = new Watchlist()
      userWatchlist.userId = user.id

      const watchlist = await Watchlist.create(userWatchlist)
      watchlist.save()
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
}
