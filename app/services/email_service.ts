import mail from '@adonisjs/mail/services/main'

export default class EmailService {
  async sendEmail<T>(to: string, from: string, subject: string, template: string, data: T) {
    await mail.send((message) => {
      message.to(to).from(from).subject(subject).htmlView(template, { data })
    })
  }
}
