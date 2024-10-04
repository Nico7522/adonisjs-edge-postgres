import Roles from '#enums/role'
import UnAuthorizedException from '#exceptions/un_authorized_exception'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const isAdmin = ctx.auth.user?.roleId === Roles.ADMIN

    if (!isAdmin) {
      throw new UnAuthorizedException()
    }
    const output = await next()
    return output
  }
}
