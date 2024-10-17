import AdminService from '#services/admin_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DashboardController {
  constructor(private _adminService: AdminService) {}
  async handle({ view }: HttpContext) {
    const { moviesCount, unreleased, totalUsers, totalActors } =
      await this._adminService.getMovieStats()
    return view.render('pages/admin/dashboard', {
      moviesCount,
      unreleased,
      totalUsers,
      released: moviesCount.$extras.count - unreleased.$extras.count,
      totalActors,
    })
  }
}
