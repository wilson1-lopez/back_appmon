import RoleService from "#services/RoleService"
import { HttpContext } from "@adonisjs/core/http"


export default class RoleController {
  private roleService = new RoleService()

  public async index({ response }: HttpContext) {
    const roles = await this.roleService.getAllRoles()
    return response.ok(roles)
  }
}
