import User from '#models/user'
import Watchlist from '#models/watchlist'
import { LoginForm } from '../forms/login-form.js'
import { RegisterForm } from '../forms/register-form.js'

export default class UserService {
  static async register(data: RegisterForm) {
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
}
