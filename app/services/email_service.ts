import Token from '#models/token'
import User from '#models/user'
import mail from '@adonisjs/mail/services/main'

export default class EmailService {
  async sendEmail<T>(to: string, from: string, subject: string, template: string, data: T) {
    await mail.send((message) => {
      message.to(to).from(from).subject(subject).htmlView(template, { data })
    })
  }

  async sendVerifyEmail(user: User) {
    const token = await Token.generateVerifyEmailToken(user)
    await this.sendEmail(
      user.email,
      'nico.daddabbo7100@gmail.com',
      'Account Confirmation',
      'emails/verify_email_html',
      { firstname: user.firstname, token }
    )
  }
}
