import CompanyService from '#services/CompanyService'
import { HttpContext } from '@adonisjs/core/http'

export default class AccountActivationController {
    
  public async activate({ request, response }: HttpContext) {
    const token = request.input('token') || request.qs().token
    if (!token) {
      return response.badRequest({ message: 'Token requerido' })
    }

    const companyService = new CompanyService()
    try {
      const result = await companyService.activateCompanyAccount(token)
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  public async resend({ request, response }: HttpContext) {
    const token = request.input('token') || request.qs().token
    if (!token) {
      return response.badRequest({ message: 'Token requerido' })
    }

    const companyService = new CompanyService()
    try {
      const result = await companyService.resendActivationByToken(token)
      return response.ok(result)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}