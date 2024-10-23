import { Session } from '@adonisjs/session'

export default class Helper {
  static setFlashMessage(
    session: Session,
    key: string,
    message: string,
    code?: string,
    isError = true
  ) {
    if (isError) {
      const errorsBag = code ? { [`${code}`]: message } : { E_ERROR: message }
      session.flash({
        [`${key}`]: message,
        errorsBag: errorsBag,
      })
    } else {
      session.flash(key, message)
    }
  }
}
