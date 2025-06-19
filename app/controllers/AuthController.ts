import { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/AuthService'

export default class AuthController {
  private authService = new AuthService()

  public async login({ request, response }: HttpContext) {
    const { identifier, password } = request.only(['identifier', 'password'])
    try {
      const result = await this.authService.login(identifier, password)
      return response.ok(result)
    } catch (error) {
      return response.unauthorized({ error: error.message })
    }
  }

  // POST /auth/request-password-reset
  public async requestPasswordReset({ request, response }: HttpContext) {
    const email = request.input('email')
    const result = await this.authService.requestPasswordReset(email)
    return response.ok(result)
  }

  // POST /auth/reset-password
  public async resetPassword({ request, response }: HttpContext) {
    const token = request.input('token')
    const newPassword = request.input('newPassword')
    try {
      const result = await this.authService.resetPassword(token, newPassword)
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
