// import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import EmailService from '#services/email_service'
import { inject } from '@adonisjs/core'
@inject()
export default class TestsController {
  constructor(private _emailService: EmailService) {}
  async sendEmail() {
    const user = await User.findByOrFail('email', 'nico.daddabbo7100@gmail.com')

    console.log(user)

    await this._emailService.sendToken(user, 'emails/reset_password_html', 'passwordResetToken')
  }
}
