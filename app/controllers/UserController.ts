import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/UserService'
import { RegisterCompanyValidator } from '#validators/RegisterCompanyValidator'


export default class UserController {
  private userService = new UserService()

  

  public async registerCompany({ request, response }: HttpContext) {
  const data = await request.validate({ schema: RegisterCompanyValidator })
  try {
    const result = await this.userService.registerCompanyAndUser(data)
    return response.created({ message: 'Registro exitoso. Revise su correo para activar la cuenta.', ...result })
  } catch (error) {
    return response.badRequest({ error: error.message })
  }
  }
}
