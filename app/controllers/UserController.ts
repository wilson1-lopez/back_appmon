import { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/UserService'
import AuthService from '#services/AuthService'
import { RegisterCompanyValidator } from '#validators/RegisterCompanyValidator'


export default class UserController {
  private userService = new UserService()
  private authService = new AuthService()

  /**
   * Registrar una nueva empresa y usuario
   */
  public async registerCompany({ request, response }: HttpContext) {
    const data = await request.validate({ schema: RegisterCompanyValidator })
    try {
      const result = await this.userService.registerCompanyAndUser(data)
      return response.created({ message: 'Registro exitoso. Revise su correo para activar la cuenta.', ...result })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Obtener información del usuario actual
   */
  public async me({ auth, response }: HttpContext) {
    try {
      if (!auth?.user?.id) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }

      const user = await this.authService.getCurrentUser(auth.user.id)
      
      return response.ok({ 
        message: 'Información del usuario obtenida exitosamente',
        data: user 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Refrescar token del usuario
   */
  public async refreshToken({ auth, response }: HttpContext) {
    try {
      if (!auth?.user?.id) {
        return response.unauthorized({ error: 'Usuario no autenticado' })
      }

      const result = await this.authService.refreshToken(auth.user.id)
      
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
