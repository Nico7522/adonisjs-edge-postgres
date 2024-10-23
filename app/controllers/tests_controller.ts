import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import EmailService from '#services/email_service'
import { inject } from '@adonisjs/core'
@inject()
export default class TestsController {
  constructor(private _emailService: EmailService) {}
  async test({ view }: HttpContext) {
    return view.render('pages/test')
  }
}
