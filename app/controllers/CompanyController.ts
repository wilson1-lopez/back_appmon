import { HttpContext } from '@adonisjs/core/http'
import CompanyService from '#services/CompanyService'

export default class CompanyController {
  private companyService = new CompanyService()

  /**
   * Obtener información completa de una empresa por ID
   */
  public async show({ params, response }: HttpContext) {
    try {
      const companyId = params.id
      const company = await this.companyService.getCompanyById(companyId)
      
      if (!company) {
        return response.notFound({ error: 'Empresa no encontrada' })
      }

      return response.ok({ 
        message: 'Información de empresa obtenida exitosamente',
        data: company 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Obtener información completa de una empresa por email
   */
  public async getByEmail({ params, response }: HttpContext) {
    try {
      const email = params.email
      const company = await this.companyService.getCompanyByEmail(email)
      
      if (!company) {
        return response.notFound({ error: 'Empresa no encontrada' })
      }

      return response.ok({ 
        message: 'Información de empresa obtenida exitosamente',
        data: company 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Listar todas las empresas con información básica
   */
  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const status = request.input('status')
      
      const companies = await this.companyService.getCompanies({ page, limit, status })
      
      return response.ok({ 
        message: 'Lista de empresas obtenida exitosamente',
        data: companies 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }

  /**
   * Actualizar información de la empresa
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      const companyId = params.id
      const updateData = request.only([
        'name', 'address', 'phone', 'email', 'logoUrl', 
        'companyTypeId', 'status', 'countryId', 'stateId', 'cityId'
      ])
      
      const company = await this.companyService.updateCompany(companyId, updateData)
      
      return response.ok({ 
        message: 'Empresa actualizada exitosamente',
        data: company 
      })
    } catch (error) {
      return response.badRequest({ error: error.message })
    }
  }
}
