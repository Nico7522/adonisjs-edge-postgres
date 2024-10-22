import { Session } from '@adonisjs/session'

export default class Helper {
  static setFlashMessage(session: Session, key: string, message: string, code?: string) {
    const ErrorsBags = code ? { [`${code}`]: message } : { E_ERROR: message }
    session.flash({
      [`${key}`]: message,
      errorsBag: ErrorsBags,
    })
  }
}
