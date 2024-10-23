import { Exception } from '@adonisjs/core/exceptions'

export default class InvalidTokenException extends Exception {
  static message = 'Invalid token'
  static status = 400
  static code = 'E_BADTOKEN'
}
