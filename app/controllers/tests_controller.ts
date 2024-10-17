// import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class TestsController {
  async sendEmail() {
    const result = await mail.send((message) => {
      message
        .to('nico.daddabbo7100@gmail.com')
        .from('nico.daddabbo7100@gmail.com')
        .subject('Account confirmation')
        .htmlView('emails/verify_email_html', { data: 'Nicolas' })
    })

    console.log(result)
  }
}
